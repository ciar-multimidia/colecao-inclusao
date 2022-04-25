jQuery(document).ready(function($) {
    window.FakeLoader.init( { auto_hide: true } );

    var janela = $(window),
        janelaWidth = $(window).width();
    
    /////////////////////// NOTA RODAPE
    
    var focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]",
        focusedElementBeforeModal,
        modais = $('.modal'),
        overlay = $('.modalOverlay'),
        main = $('main'),
        body = $('body');


    $('.abrir_nota').click(function(e) {
        var numNota = $(this).data('nota');
        console.log(numNota);
        var modalAberto = modais.filter(function() {
            return $(this).data('nota') == numNota
        });
        // console.log(modalAberto); 
        showModal(modalAberto);
    });

    $('.fechar_nota').click(function(e) {
        hideModal();
    });

    modais.keydown(function(event) {
        trapTabKey($(this), event);
    })

    modais.keydown(function(event) {
        trapEscapeKey($(this), event);
    })


    function trapEscapeKey(obj, evt) {
        // if escape pressed
        if (evt.which == 27) {

            // get list of all children elements in given object
            var o = obj.find('*');

            // get list of focusable items
            var cancelElement;
            cancelElement = o.filter(".fechar_nota")

            // close the modal window
            cancelElement.click();
            evt.preventDefault();
        }

    }

    function trapTabKey(obj, evt) {

        // if tab or shift-tab pressed
        if (evt.which == 9) {

            // get list of all children elements in given object
            var o = obj.find('*');

            // get list of focusable items
            var focusableItems;
            focusableItems = o.filter(focusableElementsString).filter(':visible')

            // get currently focused item
            var focusedItem;
            focusedItem = $(':focus');

            // get the number of focusable items
            var numberOfFocusableItems;
            numberOfFocusableItems = focusableItems.length

            // get the index of the currently focused item
            var focusedItemIndex;
            focusedItemIndex = focusableItems.index(focusedItem);

            if (evt.shiftKey) {
                //back tab
                // if focused on first item and user preses back-tab, go to the last focusable item
                if (focusedItemIndex == 0) {
                    focusableItems.get(numberOfFocusableItems - 1).focus();
                    evt.preventDefault();
                }

            } else {
                //forward tab
                // if focused on the last item and user preses tab, go to the first focusable item
                if (focusedItemIndex == numberOfFocusableItems - 1) {
                    focusableItems.get(0).focus();
                    evt.preventDefault();
                }
            }
        }

    }

    function setInitialFocusModal(obj) {
        // get list of all children elements in given object
        var o = obj.find('*');

        // set focus to first focusable item
        var focusableItems;
        focusableItems = o.filter(focusableElementsString).filter(':visible').first().focus();

    }

    function setFocusToFirstItemInModal(obj){
        // get list of all children elements in given object
        var o = obj.find('*');

        // set the focus to the first keyboard focusable item
        o.filter(focusableElementsString).filter(':visible').first().focus();
    }

    function showModal(obj) {
        main.attr('aria-hidden', 'true'); // mark the main page as hidden
        overlay.css('display', 'block'); // insert an overlay to prevent clicking and make a visual change to indicate the main apge is not available
        obj.css('display', 'block'); // make the modal window visible
        obj.attr('aria-hidden', 'false'); // mark the modal window as visible

        // attach a listener to redirect the tab to the modal window if the user somehow gets out of the modal window
        body.on('focusin','main',function() {
            setFocusToFirstItemInModal(obj);
        })

        // save current focus
        focusedElementBeforeModal = $(':focus');

        setFocusToFirstItemInModal(obj);
    }

    function hideModal() {
        overlay.css('display', 'none'); // remove the overlay in order to make the main screen available again
        modais.css('display', 'none'); // hide the modal window
        modais.attr('aria-hidden', 'true'); // mark the modal window as hidden
        main.attr('aria-hidden', 'false'); // mark the main page as visible

        // remove the listener which redirects tab keys in the main content area to the modal
        body.off('focusin','main');

        // set focus back to element that had it before the modal was opened
        focusedElementBeforeModal.focus();
    }


    /////////////////////// OUTRAS FUNCOES
    $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
    });

    /////////////////////// SUBIR TOPO
    var irAoTopo = $('#toTop');


    /////////////////////// EVENTOS DE JANELA
    janela.bind('scroll', function () {
      if (janela.scrollTop() > 350) {
        irAoTopo.addClass('mostra');
      } else if (janela.scrollTop() < 350) {
        irAoTopo.removeClass('mostra');
      }
    }); 



    /////////////////////// AUDIOS
    var $audioPlayers = $(".audio-player");

    $.each($audioPlayers, function(index, val) {
        var isPlaying;
        var $player = $(val);
        var $progresso = $player.find(".progresso");
        var $thisAudio = $player.find("audio");
        var $thisPlayPause = $player.find(".bt-play-pause");
        var $thisStop = $player.find(".bt-stop");
        var $tempo = $player.find(".tempo");
        var duracaoAudio = $thisAudio[0].duration;

        $thisAudio.on('canplaythrough', function(event) {
            // console.log($(this).attr("src"));
            event.preventDefault();
            duracaoAudio = $thisAudio[0].duration;
            $tempo.find(".total").text(Math.floor(duracaoAudio/60) + ":" + ("0"+Math.floor(duracaoAudio % 60)).slice(-2) );
            $(this)
            .on('playing', function(event) {
                isPlaying = true;
                $thisPlayPause.removeClass('play').addClass("pause");
            })
            .on('pause', function(event) {
                isPlaying = false;
                $thisPlayPause.removeClass('pause').addClass("play");
            })
            .on('timeupdate', function(event) {
                $progresso.css('width', (this.currentTime/duracaoAudio*100).toFixed(2)+"%");
                $tempo.find(".atual").text( (this.currentTime >= 60 ? Math.floor(this.currentTime/60) : 0) + ":" + ("0"+Math.floor(this.currentTime % 60)).slice(-2) );
            })
            .on('ended', function(event){
                $progresso.css('width', "0%");
                $tempo.find(".atual").text("0:00");
            });

            $thisPlayPause.on('click', function(event) {
                if (isPlaying) {
                    $thisAudio[0].pause();
                }
                else {
                    $thisAudio[0].play();
                }
            });

            $thisStop.on('click', function(event) {
                    $thisAudio[0].pause();
                    $thisAudio[0].currentTime = 0;
            });
        });

        if (!isNaN(duracaoAudio)) {
            // console.log($thisAudio.attr("src") + "ja tava carregado, forcando evento");

            $thisAudio.trigger("canplaythrough")
        };

      

       

    });



});
