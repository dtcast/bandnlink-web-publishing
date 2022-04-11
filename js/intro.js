$('header').css('background', 'transparent');

let introPageDst = null;
let lockSection = null;
new fullpage("#intro-page", {
  sectionsColor: ["#ffffff", "#3182F6", "#ffffff"],
  menu: "#menu",
  onLeave: function (origin, destination, direction) {
    if (destination.index == 2) {
      $("header").removeClass("white");
    } else {
      $("header").addClass("white");
    }

    enterSlide(destination.index);
  },
  afterRender: function () {},
  afterResize: function (width, height) {},
  afterLoad: function (origin, destination, direction) {
    introPageDst = destination;
    if (lockSection) {
      lockSection.isLock = destination.index != 2;
    }
  },
});

function enterSlide(index) {
  if(index == 0) {
	gsap.fromTo(
		".section0 .container",
		{ opacity: 0, y: 150 },
		{ opacity: 1, y: 0, duration: 1 }
	  );
  }
  else if(index == 1) {
	gsap.fromTo(
		".section1 .container",
		{ opacity: 0, y: 150 },
		{ opacity: 1, y: 0, duration: 1 }
	  );
  }else if(index == 2) {
	gsap.fromTo(
		".section2 .container",
		{ opacity: 0, y: 150 },
		{ opacity: 1, y: 0, duration: 1 }
	  );
  }
}
$(function () {
	enterSlide(0);
});

function LockSection() {
  this.index = 0;
  this.isLock = false;
  this.isFirst = true;
  this.isLast = false;
  this.itemCount = 3;

  this.updateIndexWithOffset = function (offset) {
    if (this.isLock) {
      return;
    }
    this.isLock = true;

    let targetIndex = this.index + offset;
    targetIndex = targetIndex < 0 ? 0 : targetIndex;
    targetIndex =
      targetIndex >= this.itemCount ? this.itemCount - 1 : targetIndex;

    $(".lock-section .submenu > li").removeClass("active");
    $(".lock-section .submenu > li").eq(targetIndex).addClass("active");

    $(".lock-section .img-wrap > img").removeClass("active");
    $(".lock-section .img-wrap > img").eq(targetIndex).addClass("active");

    this.isFirst = false;
    this.isLast = false;

    setTimeout(() => {
      this.index = targetIndex;
      this.isFirst = this.index == 0;
      this.isLast == (this.index == this.itemCount - 1);
      this.isLock = false;
      this.isLock = false;
    }, 600);
  };

  const t = this;
  this.preventScroll = function (e) {
    var section = t;
    const offset = e.deltaY;
    if (offset > 60) {
      if (!introPageDst.isLast && section.isLast) {
        return true;
      }

      section.updateIndexWithOffset(1);
    } else if (offset < -60) {
      if (!introPageDst.isFirst && section.isFirst) {
        return true;
      }

      section.updateIndexWithOffset(-1);
    }

    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  document
    .querySelector(".lock-section")
    .addEventListener("wheel", this.preventScroll, { passive: false });
}
lockSection = new LockSection();
AOS.init();
