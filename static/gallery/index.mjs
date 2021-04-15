import constants from '../assets/constants.mjs'

const { baseURL } = constants

class Gallery {
    constructor() {
        this._init()
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

        $('#inputPhoto').on('change', async function() {
            const username = localStorage.getItem('userrecognized')
            const url = URL.createObjectURL(this.files[0])
            const id = `${username}-${Date.now()}`

            $('#uploads').append(`
                <div id="${id}" class="card">
                    <img loading=lazy src="${url}">
                </div>
            `)

            const fetchImgToBlob = await fetch(url)
            const blob = await fetchImgToBlob.blob()

            const reader = new FileReader()

            reader.onloadend = async () => {
                const response = await fetch(`${baseURL}/upload`, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        b64img: reader.result, 
                        username 
                    })
                })
    
                const data = await response.json()
                
                if(data.statusCode != 200) {
                    alert("Error on upload")
                    
                    $(`#${id}`).remove()
    
                    return
                }
    
                $('#inputPhoto').val('')
            }

            reader.readAsDataURL(blob)
        })
    }
}

export default Gallery