 window.onload = function () {
   // отключаем автоматическую  прокрутку слайдера
   // переопределяем дефолтные стрелки слайдера на собственные
   $('#carousel-example-generic').carousel('pause');
   $('.arrow-prev').carousel('prev');
   $('.arrow-next').carousel('next');
  


  $('.item').on('swipeleft', function (e){
      $('.arrow-next').trigger('click');
      $('.aqua__next').trigger('click');
    });

   $('.item').on('swiperight', function (e){
      $('.arrow-prev').trigger('click');
      $('.aqua__prev').trigger('click');
  });

 };
 let playing = false;

 $('svg').click(() => {
   playing = !playing;
   let animation = playing ? 'stop' : 'play';
   $(`#animate_to_${animation}`).get(0).beginElement();
 });
  // ф-ция для свайпа слайдера на jquery mobile 

 //анимация при навидении на аквариумы на странице freshwater
 $('#lid-avail').hover(() => {
   $('.cap').css('fill', '#00a1e4');
 }, () => {
   $('.cap').css('fill', '#fff');
 });

 $('#lighting-avail').hover(() => {
   $('.lighting').css('fill', '#fff62a');
 }, () => {
   $('.lighting').css('fill', '#fff');
 });

 $('#nightstand-avail').hover(() => {
   $('.nightstand').css('fill', '#00a1e4');
 }, () => {
   $('.nightstand').css('fill', '#fff');
 });

 $('#edge-nightstand').hover(() => {
   $('.edge-nigth ').css('fill', '#00a1e4');
 }, () => {
   $('.edge-nigth ').css('fill', '#fff');
 });
 $('#most-lighting').hover(() => {
   $('.cover ').css('fill', '#fff62a');
 }, () => {
   $('.cover ').css('fill', '#E6E6E6');
 });
 $('#no-cover').hover(() => {
   $('.nocover ').css({
     'stroke-width': '#900px',
     'stroke': '#00a1e4'
   });
 }, () => {
   $('.nocover ').css('stroke', '#000');
 });


 /*
  *создадим массив  со сылками на изображения аквариумов, цены, объема и описания
  * для того что бы добавлять их в попап при клике
  */

 const aquariumsLg = [
     'Аквариум был сразу спланирован для помещения в стену, был подготовлен металлический каркас, под электропитание и водопровод были проложены шахты. Дизайн был разработан с учетом того, что аквариум будет просматриваться с обеих сторон.',
     '90 т.р.',
     'Псевдо-море',
     '250Л',
     'img/lg-1.jpg', 'img/lg-2.jpg', 'img/lg-3.jpg', 'img/lg-4.jpg',
   ],
   aquariumsM = [
     'Аквариум в стиле "Фен-Шуй" для "Золотых" рыбок. Имитация подводного Японского сада. Использовались натуральные коряги и камни. Растения искусственные. Рыбки "Золотые" - 4 Ситцевых Каметы, 4 Риукина и 1 Черный Телескоп.',
     '95 т.р.',
     'Фен-шуй',
     '320Л',
     'img/m-1.jpg', 'img/m-2.jpg', 'img/m-3.jpg', 'img/m-4.jpg',
   ],
   aquariumsS = [
     'Аквариум отлично вписался в интерьер и идеально гармонирует с цветом комнаты. Установка, от сборки тумбы до залива воды, заняла 5 часов.Через 5 дней запустили 8 "Цихлид"',
     '110 т.р.',
     'Псевдо-море',
     '250Л',
     'img/m-1.jpg', 'img/s-2.jpg', 'img/s-3.jpg', 'img/s-4.jpg',
   ];

// в ф-цию  aquaPopup передается выше указанный массив для того что бы отобразить его 
// на сайте при нажатии на аквариумы, то появляется модальное окно со слайдером
// так сделанно для того, чтобы не создавать несколько одинаковых молальных окон
// решение не из лучших :(
  function aquaPopup(arr) {
    $('.aquarium-descr__img_about').text(arr[0]);
    $('.aquarium__price').text(arr[1]);
    $('.aquarium__species').text(arr[2]);
    $('.aquarium__liters').text(arr[3]);
    $('#img1').attr('src', arr[4]);
    $('#img2').attr('src', arr[5]);
    $('#img3').attr('src', arr[6]);
    $('#img4').attr('src', arr[7]);
  }

  // самозапуск ф-ция для того что бы при измении размеров окна высчитать высоту блока
  // так же показать popup только на мобильных устройствах
  (function sizeWindow() {
     
    let windowWidth = $(window).width();
    
    if (windowWidth <= 480) {
      $(".work-exampls__item-man").attr('data-toggle', "modal");
    }

    $(window).resize(function() {

      $('.work-exampls__list').height($('.work-exampls__item-lg').height());
      $('.carousel-box').height($('#carousel-example-generic').height());
      $('.portfolio__sidebar').height($('.portfolio__photo').height());

      let windowWidth = $(window).width();
      if (windowWidth <= 480) {
        $(".work-exampls__item-man").attr('data-toggle', "modal");
      }
    });
  })();


 // из-за абсолютного позиционирования дочерних элеметов '.work-exampls__list' пришлось поставить ему высоту таким образом:
 $('.carousel-box').height($('#carousel-example-generic').height());
 $('.work-exampls__list').height($('.work-exampls__item-lg').height()); 
 $('.portfolio__sidebar').height($('.portfolio__photo').height());

 const animationModule = (function () {
   const init = function () {
     _setUpListners();
   };
   
  
   // объявлем необходимые переменные
   let videoEl = $('video')[0]; // записываем в переменную видео ролик на странице
   let header = $('.header');
   let videoControlTitle = $('.video-control__title');
   let prevSlideArr = $('#prev-slide');
   let nextSlideArr = $('#next-slide');
   let calcBtnMain = $('#calcBtnMain');
   var flag = false;

   // @_setUpListners приватная фун-ия слушает события
   var _setUpListners = function () {
     $('.control').on('click', _animateVideoControls);
     $('.control').on('mouseenter mouseleave', _animateVideoControls); // При нажатии play присходит анимация
     $(document).on('keyup', _playOfSpacePress); // событие при нажатии пробел запускает и ост. видео
     $('#triger-item').on('click', _showSubMenu);
     $("#burger-container").on('click', _showToggleMenu);
     $(".toggle-item").on("click", toggleMenu);
   };

   $(".main-item").on("click", toggleMenu);

  // function toggleMenu в бурегер меню, при нажатии на "Аквариумы" переворачивается треугольник
  function toggleMenu() {
    $(".trinagle").toggleClass("trinagle-down")
    $(".sub-menu").toggleClass('sub-menu-show');
  }

  // function _showToggleMenu открывает меню на весь экран, затемняет контент и блюрить его
  function _showToggleMenu(){
      $("body").toggleClass('overflow-hidden');
      $(".content").toggleClass('blur');
      $(".content").toggleClass('overlay');
      $(this).toggleClass("open");
      header.toggleClass("full-screen-header ");
      $(".burger-nav__list").toggle();
  }
  //function _showSubMenu показывает и скрывает меню на маленьких экранах
  function _showSubMenu () {
    $('.nav__sub-list').toggle('400');
  }
   
   //функция для анимации элементов на карусели
   // она прринимает элемент к которому надо применить анимация, и 
   // два элемента - классы с анимациями
   function animateHim(elem, anim1, anim2) {
     if (!elem.hasClass(anim1)) {
       elem.removeClass(anim2).addClass(anim1);
     } else {
       elem.removeClass(anim1).addClass(anim2);
     }
   }

   // function animateUp запускает ф-цию animateHim и передает ей аргументы, 
   // для того что бы при наведении на кнопку "plau" скрыть остальные эдементы
   function animateUp() {
     animateHim(header, 'fadeOutUp', 'fadeInDown');
     animateHim(prevSlideArr, 'fadeOutLeft', 'fadeInLeft');
     animateHim(nextSlideArr, 'fadeOutRight', 'fadeInRight');
     animateHim(calcBtnMain, 'fadeOutDown', 'fadeInUp');
     videoControlTitle.text('Смотреть видео').css({
       'color': '#00a1e4',
       'margin-right': '150px'
     });
   }

   // function animateIn зпускает ф-цию animateHim передает ей аргументы,
   // и возвращает те элементы, при уведениии курсора от кнопки "play"
   function animateIn() {
     videoControlTitle.text('Запуск аквариума 250л').css({
       'color': '#fff',
       'margin-right': '0px'
     });
     animateHim(header, 'fadeInDown', 'fadeOutUp');
     animateHim(prevSlideArr, 'fadeInLeft', 'fadeOutLeft');
     animateHim(nextSlideArr, 'fadeInRight', 'fadeOutRight');
     animateHim(calcBtnMain, 'fadeInUp', 'fadeOutDown');
   }
   
   var _animateVideoControls = function (e) {
     if (e.type === 'click') {
       var attrSrc = $("#source-video").attr("src");
       var dataSrc = $("#source-video").data("src");
       videoControlTitle.fadeToggle('slow', 'linear');
       $("#source-video").attr("src", dataSrc);
       $("#source-video").data("src", attrSrc);
       $(".item").toggleClass("unlock_opacity");
       playVideo();
       animateUp();
     }
     if (e.type === 'mouseenter' && $("#source-video").attr("src") == "img/sibaqua.webm") {
       animateUp();
     } else if (e.type === 'mouseleave' && $("#source-video").attr("src") == "img/sibaqua.webm") {
       animateIn();
     }
   };

   // @_playOfSpacePress воспроизводит видео при нажатии на пробел
   var _playOfSpacePress = function (e) {
     e.preventDefault();

     const KEY_SPACE = 32; // код кнопки
     if (e.which == KEY_SPACE) {
       playVideo();
     }
   };
   // @playVideo запускает либо останавливает видео
   function playVideo() {
     const method = videoEl.paused ? 'play' : 'load';
     videoEl[method]();
     animateUp();
   }
   return {
     init
   };
 }()); //end animationModule
 animationModule.init();
 
 // функция @popupAquqriumsDescr передает в модальное окно, то изображение которое необходимо
 // так как у каждого авкариума свое модальнрое окно со своими картинкми, описанием и ценами
 const popupAquqriumsDescr = (function () {
   const init = () => {
     _setUpListeners();
   };
   let _setUpListeners = () => {
     $('.work-exampls__list').on('click', 'span', showPopup);
   };

   let showPopup = function (e) {
     const target = e.target.className;
     if (target === 'position-img img-lg') {
       aquaPopup(aquariumsLg);
     } else if (target === 'position-img img-m') {
       aquaPopup(aquariumsM);
     } else {
       aquaPopup(aquariumsS);
     }
   };

   return {
     init: init
   };
 }());
 popupAquqriumsDescr.init();