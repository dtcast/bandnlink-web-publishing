$("header").css("background", "transparent");

let introPageDst = null;
let lockSection = null;
let isScreen3Init = false;

new fullpage("#intro-page", {
  sectionsColor: ["#ffffff", "#3182F6", "#ffffff", "#ffffff"],
  menu: "#menu",
  scrollingSpeed: 800,
  navigation: true,
  slidesNavigation: true,
  controlArrows: false,
  onLeave: function (origin, destination, direction) {
    if (destination.index == 2 || destination.index == 3) {
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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function enterSlide(index) {
  if (index == 0) {
    gsap.fromTo(
      ".section0 .container",
      { opacity: 0, y: 150 },
      { opacity: 1, y: 0, duration: 1 }
    );
  } else if (index == 1) {
    gsap.fromTo(
      ".section1 .container",
      { opacity: 0, y: 150 },
      { opacity: 1, y: 0, duration: 1 }
    );
  } else if (index == 2) {
    gsap.fromTo(
      ".section2 .container",
      { opacity: 0, y: 150 },
      { opacity: 1, y: 0, duration: 1 }
    );
  } else if (index == 3) {
    if (isScreen3Init) {
      return;
    }
	isScreen3Init = true

    gsap.fromTo(
      ".section3 .container",
      { opacity: 0, y: 0 },
      { opacity: 1, y: 0, duration: 2 }
    );

    const items = document.querySelectorAll(".section3 .number");
    gsap.from(items, {
      textContent: 0,
      duration: 4,
      ease: Power1.easeIn,
      snap: { textContent: 1 },
      stagger: {
        each: 1,
        onUpdate: function () {
          this.targets()[0].innerHTML = numberWithCommas(
            Math.ceil(this.targets()[0].textContent)
          );
        },
      },
    });

    function animateLogo(element) {
      gsap.to(element, {
        delay: gsap.utils.random(1, 3),
        opacity: 1,
        duration: 1,
        // repeat: 1,
        // repeatDelay: 1,
        // ease: "none",
        onComplete: () => animateLogo(element),
      });
    }
    const brands = document.querySelectorAll(".section3 .brands > li");
    brands.forEach((el) => animateLogo(el));
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
      this.isLast = this.index == this.itemCount - 1;
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
