$(function() {
    $.getJSON("http://cf.marketprocessor.pel.ly/trademessage/recent?currencyFrom=EUR&currencyTo=GBP", function (data) {
        var messages = [];
        $.each( data, function (key, msg) {
            messages.push('<div class="tradeRow">' +
            '<span class="rowCell">'+msg.idTransaction+'</span>' +
            '<span class="rowCell">'+msg.currencyFrom+'</span>' +
            '<span class="rowCell">'+msg.currencyTo+'</span>' +
            '<span class="rowCell">'+msg.amountSell+'</span>' +
            '<span class="rowCell">'+msg.amountBuy+'</span>' +
            '<span class="rowCell">'+msg.timestamp+'</span>' +
            '</div>');
        });

        $('#tradeHistory').append(messages.join(""));
    });

    var conn = new ab.Session('ws://cf.realtime.pel.ly:80', function() {

            function indvTradeEvent(topic, data) {
                console.log('New cf message published to topic "' + topic + '" : at ' + data.timestamp);
                if ($('#tradeHistory').children().length == 10) {
                    $('#tradeHistory div:last-child').remove();
                }
                $('#tradeHistory').prepend(
                    '<div class="tradeRow">' +
                    '<span class="rowCell">'+data.idTransaction+'</span>' +
                    '<span class="rowCell">'+data.currencyFrom+'</span>' +
                    '<span class="rowCell">'+data.currencyTo+'</span>' +
                    '<span class="rowCell">'+data.amountSell+'</span>' +
                    '<span class="rowCell">'+data.amountBuy+'</span>' +
                    '<span class="rowCell">'+data.timestamp+'</span>' +
                    '</div>');
            }
            conn.subscribe('indvTrade:EUR:GBP', indvTradeEvent);

            function totalsDataPairCurrencyEvent(topic, data) {
                console.log('New cf message published to topic "' + topic + '" : at ' + data.currencyPair);
                $('#dailyTotalCurrencyPair').text(data.currencyPair.toFixed(2));
                $('#dailyTotalCurrencySingle').text(data.currencySingle.toFixed(2));

            }

            var today = new Date();
            var todayFormat = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + today.getDate();
            conn.subscribe('total:' + todayFormat + ':EUR', totalsDataPairCurrencyEvent);

        },
        function() {
            console.warn('WebSocket connection closed');
        },
        {'skipSubprotocolCheck': true}
    );
});
