class Login {
    constructor() {        
        this._init()
    }

    _init() {
        if(navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    $("#videoLogin").srcObject = stream;
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
        $("#createAccount").on('click', () => {
            $('#App').load('./static/register/index.html');
        })

        $("#btnLogin").on('click', () => {
            $('#App').load('./static/gallery/index.html');
        })
    }
}

export default Login