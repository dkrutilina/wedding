// ===== Настройки отправки заявок =====
// Сервера у сайта нет, поэтому заявка уходит одним из двух способов:
// 1) FORM_ENDPOINT — адрес формы-сервиса (Formspree, Web3Forms и т.п.): заявка приходит на вашу почту.
//    Пример: 'https://formspree.io/f/xxxxxxxx'. Пока адрес пустой — используется способ 2.
// 2) WhatsApp: открывается чат с готовым текстом заявки, клиенту остаётся нажать «Отправить».
var FORM_ENDPOINT = '';
var WHATSAPP_PHONE = '79049207777';      // номер салона в международном формате, без «+»
var PHONE_TEXT = '8 (904) 920-77-77';

(function () {
    var modal = document.getElementById('modal');
    if (!modal) return;
    var form = document.getElementById('booking');
    var interest = document.getElementById('interest');
    var ok = form.querySelector('.modal__ok');

    document.querySelectorAll('[data-open]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var topic = btn.getAttribute('data-open');
            interest.value = topic.indexOf('Запись') === 0 ? '' : topic;
            ok.hidden = true;
            document.getElementById('burger').checked = false;
            modal.showModal();
        });
    });
    modal.querySelector('[data-close]').addEventListener('click', function () { modal.close(); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });

    function message(data) {
        return 'Здравствуйте! Хочу записаться в Daria Wedding Studio.\n' +
            'Имя: ' + data.name + '\nТелефон: ' + data.phone +
            (data.interest ? '\nИнтересует: ' + data.interest : '') +
            (data.date ? '\nУдобная дата: ' + data.date : '') +
            '\nСтраница: ' + document.title;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var data = {
            name: form.elements.name.value.trim(),
            phone: form.elements.phone.value.trim(),
            interest: form.elements.interest.value.trim(),
            date: form.elements.date.value
        };
        if (FORM_ENDPOINT) {
            fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.assign({ message: message(data) }, data))
            }).then(function (r) {
                if (!r.ok) throw new Error('bad status');
                ok.textContent = 'Спасибо! Заявка отправлена, мы скоро свяжемся с вами.';
                form.reset();
            }).catch(function () {
                ok.textContent = 'Не удалось отправить заявку. Позвоните нам: ' + PHONE_TEXT;
            }).then(function () { ok.hidden = false; });
        } else {
            window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(message(data)), '_blank', 'noopener');
            ok.textContent = 'Открылся WhatsApp с готовой заявкой — нажмите «Отправить». Если не получилось, позвоните: ' + PHONE_TEXT;
            ok.hidden = false;
        }
    });
})();
