function selectPlan(plan){
    if(plan == 1){
        document.getElementById("planButton").value = "Conta Gratuita"
    }
    else if(plan == 2){
        document.getElementById("planButton").value = "Conta Básica"
    }
    else if (plan == 3){
        document.getElementById("planButton").value = "Conta Premium"
    }
}

$(document).ready(function () {
    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',
        language: 'pt-BR'
    });
    
});
$(document).ready(function(){
    $(":input").inputmask();
    $("#phone").inputmask({"mask": " +99 99 99999-9999"});
    // $("#date").inputmask({"mask": "dd/mm/yyyy"});
    $("#number").inputmask({ "mask": "9", "repeat": 10, "greedy": false });
    $("#password").inputmask({ "mask": "9", "repeat": 6, "greedy": false });
    $("#password2").inputmask({ "mask": "9", "repeat": 6, "greedy": false });
    $("#password3").inputmask({ "mask": "9", "repeat": 6, "greedy": false });
    $("#cpf").inputmask({"mask": "999.999.999-99"});
    $("#cep").inputmask({"mask": "99999-999"});
});