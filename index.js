const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playlist = $('.playlist')
const player = $('.player')

const heding = $('.header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [{

            name: "Em của ngày hôm qua",
            singger: "sơn Tùng",
            path: 'music/8.mp3',
            image: 'img/1.jpg'

        },
        {
            name: "Vì mẹ anh bắt chia tay",
            singger: "Miu Lê",
            path: 'music/2.mp3',
            image: 'img/miule.jpg'
        },
        {
            name: "Một cú lừa",
            singger: "Bích Phương",
            path: 'music/3.mp3',
            image: 'img/bichphuong.jpg'
        },
        {
            name: "Em bỏ hút thuốc chưa",
            singger: "Bích Phương",
            path: 'music/4.mp3',
            image: 'img/bichphuong.jpg'
        },
        {
            name: "Nàng thơ",
            singger: "Hoàng Dũng",
            path: 'music/5.mp3',
            image: 'img/hoangdung.jpg'
        },
        {
            name: "Tháng mấy em nhớ anh?",
            singger: "Hà Anh Tuấn",
            path: 'music/6.mp3',
            image: 'img/haanhtuan.jpg'
        },
        {
            name: "Hẹn ước từ hư vô",
            singger: "Mỹ Tâm",
            path: 'music/7.mp3',
            image: 'img/mytam.jpg'
        },
        {
            name: "Bên trên tầng lầu",
            singger: "Thanh Minh",
            path: 'music/1.mp3',
            image: 'img/minh.jpg'
        },
        {
            name: "Không phải dạng vừa đâu",
            singger: "Sơn Tùng",
            path: 'music/9.mp3',
            image: 'img/1.jpg'
        },
        {
            name: "Remember Me",
            singger: "Sơn Tùng",
            path: 'music/10.mp3',
            image: 'img/1.jpg'
        }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index==this.currentIndex ? 'active' : ""}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singger}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
                `
        })
        playlist.innerHTML = htmls.join('')
    },
    handleEvents: function() {

        const cdWidth = cd.offsetWidth
            // xu ly CD quay va dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: "rotate(360deg)" }
        ], {
            duration: 20000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()


        // xu ly phong to thu nho cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth

        }

        //xu ly khi click playBtn
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause()

            } else {
                audio.play()
            }
        }

        //khi song dc player
        audio.onplay = function() {
                app.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()

            }
            //khi song bi pause
        audio.onpause = function() {
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            // tra ve thoi luong cua am thanh
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent

            }
        }

        // xu ly khi tu hat
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // khi next bai hat
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {

                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {

                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // xu ly random/ bat ttatt
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom)
        }

        // xu ly next xong audio chay tiep 
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play()
            } else {
                nextBtn.onclick()
            }

        }

        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active', app.isRepeat)

        }


        // lang nghe hanh vi click vao playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
                // xu ly khi click vao Song thi chuyen den bai do
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }

            }
        }




    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 300);
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function() {

        console.log(heding, cdThumb, audio)
        heding.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex === this.currentIndex)
        this.currentIndex = newIndex

        this.loadCurrentSong()

    },
    start: function() {
        // dinh nghia cac thuoc tinh cho Object
        this.defineProperties()

        //xu ly cac su kien
        this.handleEvents()

        //tai thong tin bai hat dau tien vao ui khi chay ung dung
        this.loadCurrentSong()



        this.render()
    }

}
app.start()