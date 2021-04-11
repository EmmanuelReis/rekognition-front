class Gallery {
    constructor() {
        this._init()

        localStorage.setItem('userrecognized', 'id')
    }

    _init() {
        this._addEventListeners()
    }

    _addEventListeners() {
        $('li').on('click', function() {
            $(this).addClass('active')
            .siblings().removeClass('active')

            $('.photosContent').css('display', 'none')
            $(`${$(this).data('id')}`).css('display', 'flex')
        })

        $('#logout').on('click', function() {
            localStorage.removeItem('userrecognized')

            $('#App').load('./static/login/index.html');
        })

        $('#cardUpload').on('click', function() {
            $('#inputPhoto').trigger('click')
        })
    }
}

export default Gallery