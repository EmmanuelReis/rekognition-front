import constants from '../assets/constants.mjs'

const { baseURL } = constants

class Login {
    constructor() {        
        this._init()
    }

    _init() {
        if(navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    document.getElementById('videoLogin').srcObject = stream;
                })
                .catch((error) => {
                    console.log(error);

                    $("#face, #type, #change").css('display', 'none')
                    $("#inputs").css('display', 'flex')
                    $("#loginTitle").text('Login with user')
                    $("#btnLogin").attr('data-login', 'inputs')
                });
        }

        this._addEventListeners()
    }

    _addEventListeners() {
        $('input').on('focus', () => {
            $('#alert').removeClass('error').fadeOut(500)
        })

        $('#createAccount').on('click', () => {
            if(document.getElementById('videoLogin').srcObject)
                document.getElementById('videoLogin').srcObject.getTracks().forEach(function(track) {
                    track.stop();
                });

            $('#App').load('./static/register/index.html');
        })

        $('#type').on('click', function() {
            const [source, target] = [
                $('#btnLogin').attr('data-login'), 
                $('#btnLogin').attr('data-login') == 'face' ? 'inputs' : 'face'
            ]

            $('#btnLogin').attr('data-login', target)
            
            $(`#${source}`).css('display', 'none')
            $(`#${target}`).css('display', 'flex')
        })

        $('#btnLogin').on('click', async (event) => {
            const button = $(event.currentTarget)

            if(button.hasClass('disabled'))
                return

            $('#alert').removeClass('error').fadeOut(500)

            button.addClass('disabled')
            
            const data = await this[`login_with_${button.attr('data-login')}`]()
            
            button.removeClass('disabled')

            if(data.statusCode == 200 && data.message == 'Logged') {
                localStorage.setItem('userrecognized', data.username)
                
                if(document.getElementById('videoLogin').srcObject)
                    document.getElementById('videoLogin').srcObject.getTracks().forEach(function(track) {
                        track.stop();
                    });
                
                $('#App').load('./static/gallery/index.html')
            }
            else {
                $('#alert').addClass('error').text(data.message).fadeIn(500)
            }
        })
    }

    async login_with_inputs() {
        const response = await fetch(`${baseURL}/login`, {
            method: 'POST',
            body: JSON.stringify({
                username: $('#inputUser').val(),
                password: $('#inputPwd').val()
            })
        })
        
        return await response.json()
    }

    async login_with_face() {
        let canvas = document.createElement('canvas')
        let video = $('#videoLogin').get(0)

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        canvas.getContext("2d")
        .drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

        const b64img = canvas.toDataURL()

        $('#picture').css('display', 'block').css('background-image', `url('${b64img}')`)
        
        const response =  await fetch(`${baseURL}/reconhecimento`, {
            method: 'POST',
            body: JSON.stringify({
                b64img
            })
        })
        
        $('#picture').css('display', 'none')

        return await response.json()
    }
}

export default Login