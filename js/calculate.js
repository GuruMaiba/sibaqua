
const calcAqua = (function () {
  let init = () => {
    _setUpListners();
    rangeSlider();
  };

  // переменные глобальные внутри ф-ции calcAqua
  let result = '0';
  let speciesElemVal = 1; // значение выбранного типа аквариума, по умолчанию 1 - "Стандарт"
  let decorElemVal = 240; // значение выбронной декорации аквариума, по умолчания 240, что соответсвует - "Живые растения"
  let res; // итоговая цена на пресноводеый аквариум
  let type; // тип выбранного аквариума стандарт/акваскейп, эта переменная для того чтобы записать в нее значение и отправляетьна почту 
  let inTotal; // цена на пузырьковые панели
  let cell;  // кол-во ячеек пузырьковых панелей
  let outputValidText = $('.calculate__size-text');
  let widthAqua = $("#aqua-width"); // ширина пресноводного аквариума 
  let priceOfService; // итоговая ценна за обслуживание, ее значение отправляется на почту 
  let serviceOfLiters = $('.range-slider__value').text();
  
  let _setUpListners = () => {
    $('.calculate__size-group').on('change', '.calculate__size-input', onChangeSize);
    //валидация размеров аквариума на событие "change" колбек @validSizeAqua
    $('.calculate__size-input').on('change', validSizeAqua);
    // $('.range-slider__range').on('input', serviceTotal);
    $('.calculate__decor').on('change', _changeDecor);
    $('.calculate__species').on('change', changeSpecies);
    $('.calculate__controls').on('change', totalPriceCalc);
    // при нажатии кнопки "подробный расчет"" отправим данный в калькуляторе на почту
    $('#send-calc-val').on('click', serializeValOfCalc);
  };

  function totalPriceCalc(e) {
    const eTarget = e.target;
    const dataEvent = e.target.getAttribute('data-event');
    if (dataEvent) {
      totalPrice(result, speciesElemVal, decorElemVal);
    }
  }


  // переменные для вычесление обслуживания локальные
  let slider = $('.range-slider'),
    range = $('.range-slider__range'),
    value = $('.range-slider__value'),
    outHeight = $('.output__height'),
    outWidth = $('.output__width'),
    outLiters = $('.output__liters');

  function onChangeSize() {
    outputValidText.text(" ");
    const aquaWidth = $('#aqua-width').val();
    const aquaLength = $('#aqua-length').val();
    const aquaHeight = $('#aqua-height').val();

    result = calculator(aquaWidth, aquaLength, aquaHeight);
    $('.liters').text(`${result} л`);
  }

  // с помощью метода reduce умножим полученную ширину*длинну*высоту
  // чтобы вычеслить объем аквариума, но перед этим переданные в функцию аргументы необходимо
  // превратить в массив

  function calculator() {
    // из полученных аргументов сделаем массив
    const args = [].slice.call(arguments);
    // проходимся по массиву ф-циеей reduce и складываем каждый элемент массива
    res = args.reduce((mul, current) => mul * current / 1000);
    return res.toFixed();
  }
  /* функция @validSizeAqua проверяет введеные значения размеров аквариумов
   * длинна от 800 до 3000
   * ширина и высота от 300 до 1000
   */
  function validSizeAqua(e) {
    const eTarget = e.target;
    const dataEvent = e.target.getAttribute('data-size');
    const value = e.target.value;
    // есди событие произошло в изменении ширины то:
    if (dataEvent == "width") {

      if (value < 800) {

        e.target.value = "800";
        outputValidText.text('Ширина должна быть не менее 800');

      }  else if (value > 3000) {

        e.target.value = "3000";
        outputValidText.text('Ширина должна быть не более 3000');

      }
      //если изменяется высота или ширина, то:
    } else if (dataEvent == "height" || dataEvent == "length") {
       
        if (value < 300 ) {

          e.target.value = "300";
          outputValidText.text('Длинна и высота должна быть не менее 300 и не более 1000');

        } else if (value > 1000) {

          e.target.value = "1000";
          outputValidText.text('Длинна и высота должна быть не менее 300 и не более 1000');

        }
      }
  }
  /*
    @rangeSlider высчитывает значения прокрутки слайдера
    и выводит на экран
  */

  function rangeSlider() {
    slider.each(() => {
      value.each(function () {
        let value = $(this).prev().attr('value');
        $(this).html(value);
      });

      function changeValue(e) {
        if ($(this).attr('max') == 3000) {
          let heightVal = this.value;
          outHeight.children().html(`${heightVal}  mm |`);
        }

        if ($(this).attr('max') == 1200) {
          let widthVal = this.value;
          const valCell = widthVal / 65;
          cell = valCell.toFixed();
          $('.output__cells span').text(cell);
          outWidth.children().html(`${this.value}  mm |`);
        }

        if ($(this).attr('max') == 1000) value.text(this.value);

        const eTarget = e.target;
        const dataEvent = e.target.getAttribute('data-event');

        // проверка где произошло событие, если условие верное значит это калькулятор обслжуивания и вызовим
        // ф-цию которая считает стоимость обслуживания

        if (dataEvent) {
          let valOfService = $(this).val();
          priceOfService = priceService(valOfService);
          $('.price').html('&asymp; ' + priceOfService);

        }

        const valH = $('#height-val').val();
        const valW = $('#width-val').val();
        const totalService = (Number(valH) * Number(valW)) / 100 * 4;
        inTotal = totalService.toFixed();


        $('.price span').text(inTotal);

      }
      // Навесим обработчик на '.range-slider' и делегируем
      slider.delegate('.range-slider__range', 'input', changeValue);
    });
  }
  /*
    @priceService функция, которая считает стоимость обслуживания
  */
  function priceService(valOfService) {
    let resChangeOfService;

    if (valOfService >= 0 && valOfService <= 200) {

      resChangeOfService = 3800;

      return resChangeOfService;

    } else if (valOfService > 200 && valOfService <= 300) {

      resChangeOfService = 4500;
      return resChangeOfService;

    } else if (valOfService > 300 && valOfService <= 400) {

      resChangeOfService = 5500;
      return resChangeOfService;

    } else if (valOfService > 400 && valOfService <= 600) {

      resChangeOfService = 6500;
      return resChangeOfService;

    } else if (valOfService > 600 && valOfService <= 800) {

      resChangeOfService = 8100;
      return resChangeOfService;

    } else if (valOfService > 600 && valOfService <= 800) {

      resChangeOfService = 8100;
      return resChangeOfService;

    } else if (valOfService > 800 && valOfService <= 1000) {

      resChangeOfService = 9900;
      return resChangeOfService;

    }
  }

  /*
    функции changeSpecie _changeDecor берут значения хранящиеся в их инпутах 
    они практически одинаковые надо объеденить в одну для избежания дублирования кода
  */
  function changeSpecies() {

    const speciesAquaInput = $(this).children('input');

    speciesAquaInput.each((ndx, val) => {
      const element = $(val);
      const value = element.val();

      if (element.prop('checked')) {
        speciesElemVal = value;
        type = (speciesElemVal == 1) ? "Стандарт" : "Акваскейп";
      }

    });
  }

  function _changeDecor() {

    const decorAquaInput = $(this).children('input');

    decorAquaInput.each((ndx, val) => {
      const element = $(val);
      const value = element.val();

      if (element.prop('checked')) {
        decorElemVal = value;
      }

    });
  }

  /* 
      @ totalPrice функция делает практически все то же что и @calculator, то етсь проводит вычесления со входящими значениями
      и вывод результат. для избежания дублирования надо их объеденить
  */
  function totalPrice() {
    const args = [].slice.call(arguments);
    const res = args.reduce((mul, current) => mul * current);
    //выводить результат расчета только если он больше 0
    let totalResult = res > 0 ? `от ${res}` : " ";
    
    $('.price span').text(totalResult);
  }

/*
  @serializeValOfCalc собирает данные из калькулятора вставляет в скрытый инпута, который в форме отправки заявки
 */
  function serializeValOfCalc() {

    let info = '';
    let locPage = document.location.href;
    
    if (locPage.indexOf('freshwater') > -1) {

        info +=   '<div>Пресноводные аквариумы</div>' +
                  '<div>типа:' + type + '</div>' +
                  '<div>ширина:' + $('#aqua-width').val() + '</div>' +
                  '<div>высота:' + $('#aqua-height').val() + '</div>' +
                  '<div>длинна:' + $('#aqua-length').val() + '</div>' +
                  '<div>объем:' + result + '</div>' +
                  '<div>растения:' + decorElemVal + '</div>' +
                  '<div>итого:' + res + '</div>';
        $('#hidden-input').val(info);
    } else if (locPage.indexOf('bubblepanels') > -1) {
          info += '<div>Пузырьковые панели</div>' +
                  '<div>ширина:' + $('#height-val').val() + '</div>' +
                  '<div>высота:' + $('#width-val').val() + '</div>' +
                  '<div>количество ячеек:' + cell + '</div>' +
                  '<div>итого:' + inTotal + '</div>';
        $('#hidden-input').val(info);
    } else if (locPage.indexOf('service') > -1) {
        info += `<div>Обслуживание </div>
                 <div>литров: ${serviceOfLiters}</div>
                 <div>цена: ${priceOfService}</div>`
    }
    
    console.log(info);
    
  }
  return {
    init,
  };
}());
calcAqua.init();
