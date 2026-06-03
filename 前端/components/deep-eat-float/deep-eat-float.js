const STORAGE_KEY = "deep_eat_float_pos";
const BALL_RPX = 120;
const EDGE_PADDING = 12;

Component({
  data: {
    x: 0,
    y: 0,
    collapsed: false,
    collapseSide: "right",
    hidden: false,
    dragging: false
  },

  lifetimes: {
    attached() {
      this.initPosition();
    }
  },

  pageLifetimes: {
    show() {
      const pages = getCurrentPages();
      const route = pages[pages.length - 1]?.route || "";
      this.setData({
        hidden: route === "pages/ai/ai" || route === "pages/login/login"
      });
    }
  },

  methods: {
    initPosition() {
      const info = wx.getWindowInfo();
      const ballPx = (BALL_RPX / 750) * info.windowWidth;
      this._ballPx = ballPx;
      this._windowWidth = info.windowWidth;
      this._windowHeight = info.windowHeight;
      this._topLimit = info.statusBarHeight + 8;
      this._bottomLimit = info.windowHeight - ballPx - 150;

      const pages = getCurrentPages();
      const route = pages[pages.length - 1]?.route || "";
      const hidden = route === "pages/ai/ai" || route === "pages/login/login";

      const saved = wx.getStorageSync(STORAGE_KEY);
      if (saved && typeof saved.x === "number" && this.isPositionVisible(saved.x, saved.y, ballPx)) {
        this.setData({
          x: saved.x,
          y: this.clampY(saved.y),
          collapsed: !!saved.collapsed,
          collapseSide: saved.collapseSide || "right",
          hidden
        });
        return;
      }

      this.setData({
        x: info.windowWidth - ballPx - EDGE_PADDING,
        y: this.clampY(info.windowHeight - ballPx - 200),
        collapsed: false,
        collapseSide: "right",
        hidden
      });
    },

    isPositionVisible(x, y, ballPx) {
      const minVisible = ballPx * 0.2;
      return (
        x > -minVisible &&
        x < this._windowWidth - minVisible &&
        y >= this._topLimit &&
        y <= this._bottomLimit
      );
    },

    clampY(y) {
      return Math.max(this._topLimit, Math.min(y, this._bottomLimit));
    },

    savePosition() {
      wx.setStorageSync(STORAGE_KEY, {
        x: this.data.x,
        y: this.data.y,
        collapsed: this.data.collapsed,
        collapseSide: this.data.collapseSide
      });
    },

    onTouchStart(e) {
      const touch = e.touches[0];
      this._startX = touch.clientX;
      this._startY = touch.clientY;
      this._originX = this.data.x;
      this._originY = this.data.y;
      this._moved = false;
      this.setData({ dragging: true });
    },

    onTouchMove(e) {
      const touch = e.touches[0];
      const dx = touch.clientX - this._startX;
      const dy = touch.clientY - this._startY;

      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        if (!this._moved && this.data.collapsed) {
          this.expandBall();
        }
        this._moved = true;
      }

      if (!this._moved) return;

      this.setData({
        x: this._originX + dx,
        y: this.clampY(this._originY + dy)
      });
    },

    onTouchEnd() {
      this.setData({ dragging: false });

      if (this._moved) {
        this.snapToEdge();
        this.savePosition();
      } else {
        this.openAiPage();
      }

      this._moved = false;
    },

    expandBall() {
      const ballPx = this._ballPx;
      let x = this.data.x;

      if (this.data.collapseSide === "left") {
        x = EDGE_PADDING;
      } else {
        x = this._windowWidth - ballPx - EDGE_PADDING;
      }

      this.setData({
        x,
        collapsed: false
      });
    },

    snapToEdge() {
      const ballPx = this._ballPx;
      const centerX = this.data.x + ballPx / 2;
      const snapThreshold = ballPx * 0.45;
      let x = this.data.x;
      let collapsed = false;
      let collapseSide = "right";

      if (centerX < this._windowWidth / 2) {
        collapseSide = "left";
        if (this.data.x <= snapThreshold) {
          x = -ballPx * 0.58;
          collapsed = true;
        } else {
          x = EDGE_PADDING;
        }
      } else {
        collapseSide = "right";
        if (this.data.x >= this._windowWidth - ballPx - snapThreshold) {
          x = this._windowWidth - ballPx * 0.42;
          collapsed = true;
        } else {
          x = this._windowWidth - ballPx - EDGE_PADDING;
        }
      }

      this.setData({
        x,
        y: this.clampY(this.data.y),
        collapsed,
        collapseSide
      });
    },

    openAiPage() {
      const pages = getCurrentPages();
      const route = pages[pages.length - 1]?.route || "";
      if (route === "pages/ai/ai") return;

      wx.navigateTo({
        url: "/pages/ai/ai",
        fail: () => {
          wx.reLaunch({ url: "/pages/ai/ai" });
        }
      });
    }
  }
});
