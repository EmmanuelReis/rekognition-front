class Register {
    constructor() {
        this._init()
    }

    _init() {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                     $("#videoRegister").srcObject = stream;
                })
                .catch((error) => {
                    console.log(error);

                     $("#videoRegister").css('display', 'none')
                });
        }

        this._addEventListeners()
    }

    _addEventListeners() {
        $("#back").on('click', () => {
            $('#App').load('./static/login/index.html');
        })

        $("#btnUpload").on('click', () => {
            $("#inputPhoto").trigger('click')
        })

        $("#preview").on('click', () => {
            $("#inputPhoto").trigger('click')
        })

        $("#inputPhoto").on('change', function() {
            $("#preview").css('background-image', `url('${URL.createObjectURL(this.files[0])}')`).css('display', 'flex')
        })

        $("form").on('submit', () => {
            return false
        })
    }
}

export default Register