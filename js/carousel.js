document.addEventListener("DOMContentLoaded", function () {
    console.log("Setting up Carousel")
    setUpCarousel()
})

var prevScrollLeft;
var childInView;

function setUpCarousel(carouselParent = null) {
    if (carouselParent == null) {
        carouselParent = document.getElementsByClassName('carousel-parent')[0]
    }
    ponyWidth = carouselParent.children[0].getBoundingClientRect().width
    prevScrollLeft = ponyWidth

    bringRightMostToLeft()
    carouselParent.scrollLeft = ponyWidth
    // prevChildInView = 1;


    carouselParent.addEventListener('scroll', () => {
        let scrollingRight = false;
        if (carouselParent.scrollLeft > prevScrollLeft) {
            scrollingRight = true;
        }
        prevScrollLeft = carouselParent.scrollLeft;
        // console.log(scrollingRight)
        ponyInView = getIndexOfChildInView()


        if (scrollingRight) {
            if (carouselParent.scrollLeft >= carouselParent.children.length * ponyWidth - 1.75 * ponyWidth) {
                bringLeftMostToRight()
            }
        }
        else {
            if (carouselParent.scrollLeft <= .75 * ponyWidth) {
                bringRightMostToLeft()
            }
        }
        // console.log(getIndexOfChildInView(carouselParent))
        // if (getIndexOfChildInView(carouselParent) <= 1) {
        // bringRightMostToLeft()
        // }
        // else if (getIndexOfChildInView(carouselParent) == carouselParent.children.length - 1) {
        // bringLeftMostToRight()
        // }
    })

}

function bringRightMostToLeft(carouselParent = null) {
    console.log("Bringing RightMost to Left")
    if (carouselParent == null) {
        carouselParent = document.getElementsByClassName('carousel-parent')[0]
    }
    rightMostChild = carouselParent.children[carouselParent.children.length - 1]
    leftMostChild = carouselParent.children[0]
    carouselParent.insertBefore(rightMostChild, leftMostChild)
    carouselParent.scrollLeft = carouselParent.scrollLeft + rightMostChild.getBoundingClientRect().width
}

function bringLeftMostToRight(carouselParent = null) {
    console.log("Bringing LeftMost to Right")
    if (carouselParent == null) {
        carouselParent = document.getElementsByClassName('carousel-parent')[0]
    }
    rightMostChild = carouselParent.children[carouselParent.children.length - 1]
    leftMostChild = carouselParent.children[0]
    carouselParent.insertBefore(leftMostChild, rightMostChild.nextSibling)
    carouselParent.scrollLeft = carouselParent.scrollLeft - leftMostChild.getBoundingClientRect().width
}

function getIndexOfChildInView(carouselParent = null) {
    if (carouselParent == null) {
        carouselParent = document.getElementsByClassName('carousel-parent')[0]
    }
    childWidth = carouselParent.children[0].getBoundingClientRect().width
    result = -Math.round(-carouselParent.scrollLeft / childWidth)
    // console.log((carouselParent.scrollLeft / childWidth).toFixed(2))
    // return Number(result.toFixed(2))
    return result
}