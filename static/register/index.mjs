import constants from '../assets/constants.mjs'

const { baseURL } = constants

class Register {
    constructor() {
        this._init()
    }

    _init() {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    document.getElementById('videoRegister').srcObject = stream;
                })
                .catch((error) => {
                    console.log(error);

                     $("#videoRegister, #btnTake").css('display', 'none')
                });
        }

        this._addEventListeners()
    }

    _addEventListeners() {
        $("#back").on('click', () => {
            if(document.getElementById('videoRegister').srcObject)
                document.getElementById('videoRegister').srcObject.getTracks().forEach(function(track) {
                    track.stop();
                });

            $('#App').load('./static/login/index.html');
        })

        $("#btnTake").on('click', () => {
            if($('#videoRegister').css('display') == 'none') {
                $("#preview").css('background-image', `url('')`).css('display', 'none')
                $('#videoRegister').css('display', 'flex')

                return
            }

            let canvas = document.createElement('canvas')
            let video = $('#videoRegister').get(0)

            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            canvas.getContext("2d")
            .drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

            const b64img = canvas.toDataURL()

            $("#preview").css('background-image', `url('${b64img}')`).css('display', 'flex')
            $('#videoRegister').css('display', 'none')
        })

        $("#btnUpload").on('click', () => {
            $("#inputPhoto").trigger('click')
        })

        $("#preview").on('click', () => {
            $("#inputPhoto").trigger('click')
        })

        $("#inputPhoto").on('change', function() {
            $("#preview").css('background-image', `url('${URL.createObjectURL(this.files[0])}')`).css('display', 'flex')
            $('#videoRegister').css('display', 'none')
        })

        $("#btnRegister").on('click', async (event) => {
            const button = $(event.currentTarget)

            if(button.hasClass('disabled'))
                return

            button.addClass('disabled')

            const url = /^url\((['"]?)(.*)\1\)$/.exec($("#preview").css('background-image'))[2]
            
            if(!url)
                return

            if(/http/.test(url)) {
                const fetchImgToBlob = await fetch(url)
                const blob = await fetchImgToBlob.blob()
    
                const reader = new FileReader()
    
                reader.onloadend = () => {
                    this.register(reader.result)
                }
    
                reader.readAsDataURL(blob)
            }
            else {
                this.register(url)
            }
        })
    }

    async register(b64img) {
        const response = await fetch(`${baseURL}/registro-user`, {
            method: 'POST',
            body: JSON.stringify({
                username: $('#inputUser').val(),
                password: $('#inputPwd').val(),
                b64img
            })
        })

        const data = await response.json()

        if(data.statusCode == 200 && data.message == 'Registered user') {
            $('#alert').removeClass('error').addClass('success').text(data.message).fadeIn(500)

            setTimeout(() => $('#alert').fadeOut(500), 5000)
        }
        else {
            $('#alert').removeClass('success').addClass('error').text(data.message).fadeIn(500)

            setTimeout(() => $('#alert').fadeOut(500), 3000)
        }

        $("#btnRegister").removeClass('disabled')
    }
}

export default Register