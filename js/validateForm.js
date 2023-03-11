'use strict';
const validateForm = (() => {
  const init = () => {
    setupListeners();
  }

  // в переменную inputs записываем все инупуты формы
  let inputs = $('.callback__form').find('input');


  const setupListeners = () => {
    $(".callback__form").on('submit', validate);
    inputs.on('blur', clearInputs)
  }

  /* функция @clearInputs очищает (т.е. убирает класс ошибки)
   * инпуты после того как валидация не прошла
   */
  function clearInputs() {
    if ($(this).hasClass('error')) {
      $(this).removeClass('error');
    }
  };

  // ф-ция с помощью регулярногшо выражения проверяет валидность номера
  function isValidPhone(myPhone) {
    var re = /^\d[\d\(\)\ -]{4,14}\d$/;
    return re.test(myPhone);
  }

  function validate(e) {
    return new Promise((resolve, reject) => {
      e.preventDefault();
      // для каждого инпута вызваем callback
      $.each(inputs, function (index, val) {
        let phone = $("#phone").val();
        let element = $(val);
        let value = element.val();

        if (!value) {
          element.addClass('error');
        } else {
          if (isValidPhone(phone)) {
            element.addClass('ok');
            resolve();
          } else {
            $("#phone").addClass('error');
            //reject();
          }
        }
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        var form = $("form").serialize();
        const xhr = new XMLHttpRequest(57);
        xhr.open('POST', '/Home/CallBack', true);
        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response);
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          }
        };
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onerror = function () {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        };
        console.log(form);
        xhr.send(form);
      });
    }).then((response) => {
      $('.callback__form, .callback-subtitle').hide();
      let name = $("#name").val();
      $('.modal-title').html(`${name}, спасибо за обращение, в ближайшее время мы с Вами обязательно свяжемся!`);
    });

  };
  return {
    init
  };
})();
validateForm.init();
