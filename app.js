class Carousel {

    /**
     * This callback is displayed as a global member.
     * @callback moveCallback
     * @param {number} index
     */

    /**
     *
     * @param {HTMLElement} element
     * @param {Object} options
     * @param {Object} [options.slidesToScroll=1] Nombre d'éléments à faire défiler
     * @param {Object} [options.slidesVisible =1] Nombre d'éléments visible dans un slide
     * @param {boolean} [options.loop=false] Doit-on boucler en fin de carousel
     */
    constructor(element, options = []) {
        this.element = element

        //A l'instanciation si les options ne sont pas définis, alors erreur
        //Obliger de créer un objet avec les options par défaut
        //On fusionne cet objet là avec des valeurs par défaut
        //1 - Un objet vide qui va obtenir les propriétés deja fusionnées
        //2 - Les propriétés par défaut
        //3 - autres options...
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false,
        }, options)

        //Converti la node list sous forme de tableau afin de récupérer les éléments en début de chargement
        let children = [].slice.call(element.children)
        this.isMobile = false
        this.currentItem = 0
        this.moveCallBacks = []

        this.root = this.createDivWithClass('carousel')
        this.container = this.createDivWithClass('carousel__container')
        this.root.setAttribute('tabindex', '0')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        //This référe to this.element - fonction fléché pour avoir le this sur la classe
        this.items = children.map((child) => {
            let item = this.createDivWithClass('carousel__item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        })
        this.setStyle()
        this.createNavigation()

        this.moveCallBacks.forEach(cb => cb(0))
        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize.bind(this))

        this.root.addEventListener('keyup', e => {
            if(e.key === 'ArrowRight' || e.key === 'Right') {
                this.next()
            } else if(e.key === 'ArrowLeft' || e.key === 'Left') {
                this.prev()
            }
        })
    }

    /**
     *
     * @param {string} className
     * @returns {HTMLElement}
     */
    createDivWithClass(className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }

    /**
     *Applique les bonne dimensions aux éléments du carousel
     */
    setStyle() {
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = (ratio * 100) + "%"
        this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%" )
    }

    /**
     *
     */
    createNavigation() {
        let nextButton = this.createDivWithClass('carousel__next')
        let prevButton = this.createDivWithClass('carousel__prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))

        if(this.options.loop === true) {
            return
        }
        this.onMove(index => {
            if(index === 0) {
                prevButton.classList.add('carousel__prev--hidden')
            } else {
                prevButton.classList.remove('carousel__prev--hidden')
            }

            if(this.items[this.currentItem + this.slidesVisible] === undefined) {
                nextButton.classList.add('carousel__next--hidden')
            } else {
                nextButton.classList.remove('carousel__next--hidden')
            }
        })
    }


    next() {
        this.goToItem(this.currentItem + this.slidesToScroll)
    }

    prev() {
        this.goToItem(this.currentItem - this.slidesToScroll)
    }

    /**
     *
     * @param {number} index
     */
    goToItem(index) {
        if(index < 0) {
            if(this.options.loop) {
                index = this.items.length - this.slidesVisible
            } else {
                return
            }

        } else if (index >= this.items.length || this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem) {
            if(this.options.loop) {
                index = 0
            } else {
                return
            }
        }

        let translateX = index * -100 / this.items.length
        this.container.style.transform = 'translate3d('+ translateX + '%, 0, 0)'
        this.currentItem = index
        this.moveCallBacks.forEach(cb => cb(index))
    }

    /**
     *
     * @param {moveCallback} cb
     */
    onMove(cb) {
        this.moveCallBacks.push(cb)
    }


    onWindowResize() {
        let mobile = window.innerWidth < 800
        if(mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
            this.moveCallBacks.forEach(cb => cb(this.currentItem))
        }
    }

    /**
     *
     * @returns {number}
     */
    get slidesToScroll() {
        return this.isMobile ? 1 : this.options.slidesToScroll
    }

    /**
     *
     * @returns {number}
     */
    get slidesVisible() {
        return this.isMobile ? 1 : this.options.slidesVisible
    }
}


if( document.readyState !== 'loading' ) {
    new Carousel(document.querySelector('#carousel1'), {
        slidesVisible: 3,
        slidesToScroll: 2,
        loop: true,
    })
    new Carousel(document.querySelector('#carousel2'), {
        slidesVisible: 2,
        slidesToScroll: 2,
    })
    new Carousel(document.querySelector('#carousel3'), {
        slidesVisible: 1,
        slidesToScroll: 1,
    })
} else {
    new Carousel(document.querySelector('#carousel1'), {
        slidesVisible: 3,
        slidesToScroll: 2,
    })
    new Carousel(document.querySelector('#carousel2'), {
        slidesVisible: 2,
        slidesToScroll: 2,
    })
    new Carousel(document.querySelector('#carousel3'), {
        slidesVisible: 1,
        slidesToScroll: 1,
    })
}