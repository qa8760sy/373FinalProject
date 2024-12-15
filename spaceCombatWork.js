
$(document).ready(function () {
    $("form").on("submit", (e) => e.preventDefault());

    {
        $("#classAttackBonus").on("input", function () {
            const val = $(this).val();
            $("#span_classAttackBonus").text(val);
        }).trigger('input');

        $("#shipArmor").on("input", function () {
            const val = $(this).val();
            $("#span_shipArmor").text(val);
        }).trigger('input');

        $("#dexAttribute").on("change", function () {
            const val = Number(Math.floor((($(this).val() - 10) / 2)));
            $("#span_dexattributetext").text(val);
        }).trigger('change');

        $("#rangemodifier").on("input", function () {
            const val = $(this).val();
            const text = spanTextForRange(val);
            $("#span_rangemodifiertext").text(text);
        }).trigger('change input');

        $("#speed").on("input", function () {
            const text = spanTextForSpeed();
            $("#span_speedtext").text(text);
        }).trigger('change input');
    }

    {
     $(".updatewhenichange").on("change", function () {
        let [attack, defense] = updateEverything();
        // console.log(attack, defense);
        // updateEverything();
        $("#span_rangedAttack").text(attack);
        $("#span_totalDefense").text(defense);
    });
    
    }

});

const $sensorOperator = $("#sensoroperatorattack, #sensordefense");
$sensorOperator.on('change', function () {
    $sensorOperator.not(this).prop('checked', false);
});

const $nameMeBetter = $("#totaldefense, #fightingdefensively");
$nameMeBetter.on('change', function () {
    // console.log("name me better called")
    $nameMeBetter.not(this).prop('checked', false);
});

const $pilotRanks =$("#ranksInPilot, #6ranksInPilot");
$pilotRanks.on('change', function (){
    $pilotRanks.not(this).prop('checked',false);
});


function updateEverything() {
    // updateTotalsSpans();
    attack = updateAttackBonus();
    defense = getDefenseModifiers();
    return [Number(attack), Number(defense)];
}

function updateAttackBonus(){
    let val = 1;
    val += Number($("#classAttackBonus").val());
    val += getDexBonus();
    val += ranksInPilot();
    val += Number($("#fireControl").val());
    val += defensiveFlying();
    val += starshipProficiency();
    val += attackFromSpeed();
    val += Number($("#batteryFire").val());
    val += Number($("#rangemodifier").val());
    val += shipControlAttack();
    // ionization
    // mutlifire/autofire
    val += battleDamage();
    return Number(val);
}

function battleDamage(){
    let val = $("input[name='checkBOX']:checked").toArray().reduce((acc,cur) => acc + Number(cur.value), 0);
    return val;
}

function dogfight(){
    return (($("#dogfight").is(':checked')) ? true : false); 
}

function attackRun(){
   return (($("#attackRun").is(':checked')) ? true : false); 
}

function shipControlAttack(){
    return Number($("#shipControl").val()) * 2;
}

function defensiveFlying(){
    if($("#fightingdefensively").is(':checked')){
        return Number(-4);
    }else if ($("#totaldefense").is(':checked')){
        return Number(-8);
    }else{
        return Number(0);
    }
}

function getDexBonus(){
    const val = $('#dexAttribute').val();
    if(val.length === 0) return Number(0);
    return Number(Math.floor((val - 10) / 2));
}

function spanTextForSpeed(){
    input = Number($("#speed").val());
    if(input == 0){
        return "Stationary";
    }else if(input == 1){
        return "Docking";
    }else if(input == 2){
        return "Cruising";
    }else if(input == 3){
        return "Attack";
    }else {
        return "Ramming";
    }
}

function defenseFromSpeed(){
    input = Number($("#speed").val());
    if(input == 0){
        return Number(-4);
    }else if(input == 1){
        return Number(-2);
    }else if(input == 2){
        return Number(0);
    }else if(input == 3){
        return Number(2);
    }else {
        return Number(4);
    }
}

function attackFromSpeed(){
    input = Number($("#speed").val());
    if(input == 0){
        return Number(0);
    }else if(input == 1){
        return Number(0);
    }else if(input == 2){
        return Number(-1);
    }else if(input == 3){
        return Number(-2);
    }else {
        return Number(-4);
    }
}

function spanTextForRange(){
    input = Number($("#rangemodifier").val());
    let str=""
    if(input == 0){
        str = "Point blank (0-1 squares)"
    }else if(input == -2){
        str = "Short (2-5 squares)"
    }else if(input == -4){
        str = "Medium (6-10 squares)"
    }else {
        str = "Long (11-20 squares)"  
    }
    return str;
}

function getCoverBonus(){
    return Number($("#cover").val());
}

function starshipProficiency(){
    return (($("#starshipProficency").is(':checked')) ? Number(0) : Number( -4));
}

function ranksInPilot(){
    if ($("#ranksInPilot").is(":checked")){
        return Number(2);
    }else if ($("#6ranksInPilot").is(':checked')){
        return Number(2);
    }else{
        return Number(0);
    }
}

function updateTotalsSpans() {
    updateTotalDefense();
}


function getDefenseModifiers() {
    let val = 14;
    val += defenseFromSize();
    val += defenseFromSpeed();    
    val += defesnseFromAttackRun();
    val += defenseFromControl();
    val += defenseFromArmor();
    val += defenseFromDefensiveFlying();
    val += defenseFromAttackRun();
    val += defenseFromSensorOp();
    val += getCoverBonus();
    return val;
}

function defenseFromSensorOp(){
    return (($("#sensordefense").is(':checked')) ? Number(2) : Number(0));
}

function defenseFromAttackRun(){
    return Number($('#attackRun').val() * -2);
}
function defenseFromDefensiveFlying(){
    if (($("#fightingdefensively").is(':checked') && $("#6ranksInPilot").is(':checked'))){
        return Number(3);
    }else if(($("#totaldefense").is(':checked') && $("#6ranksInPilot").is(':checked'))){
        return Number(6);
    }
    else if($("#fightingdefensively").is(':checked')){
        return Number(2);
    }else if ($("#totaldefense").is(':checked')){
        return Number(4);
    }else{
        return Number(0);
    }
}

function defenseFromArmor(){
    return Number($('#shipArmor').val());
}

function defenseFromControl(){
    return Number($("#shipControl").val());   
}

function defesnseFromAttackRun(){
    return (($("#attackRun").is(':checked')) ? Number(-2) : Number(0))
}

function defenseFromSize(){
    return Number($("#sizemodifier").val());
}

function updateTotalDefense() {
    $("#span_totalDefense").text(totals.defense);
}





