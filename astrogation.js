$(document).ready(function(){
    // console.log("on load was completed");

    // $("#travelingto, #travelingfrom").on("change", ()=>{
        // console.log("action");
    //     val = travelingDC(getFrom(), getTo());
    //     $("#testspan").text(val);
    // });

    $(".updatetraveltime").on("change", () =>{
        // console.log("updatetraveltime class was encountered");
        const value = getTotalTravel();
        updateTotalTravel(value);
    });

    $("#checkresult").on("change", () =>{
        const value = getCheckResult();
        // console.log(value);
        $("#extratraveltime").text(value);
    });

    $(".updateonchange").on("change", () =>{
        // console.log("updateonchange class was encountered");
        const value = getTotal();
        updateTotal(value);
    });

    $("#unset").on("click", ()=>{
        if($("input[name='dataquality']:checked")){
            $("input[name='dataquality']:checked").prop("checked", false);
        };
    });
});

function updateTotal(value){
    // console.log('tried to update span');
    $("#testspan").text(value);
}

function updateTotalTravel(value){
    $("#travetime").text(value);
}

function getTotal(){
    // console.log("Getting new Total");
    let total = 0;
    total += getDataQuality();
    total += getCircumstances();
    total += getRandomHazard();
    total += getTravelingDC();
    return total;
}

function getTotalTravel(){
    let total = 0;
    total += getTravelingTime();
    total *= getHyperDriveSpeed();
    total *= getSameQuad();
    return total;
}

function getHyperDriveSpeed(){
   return $("#hyperdrivespeed").val();
}

function getSameQuad(){
    let value = 1;
    if($("#samequadrant").is(":checked")){
        // console.log("same quad")
        value = 0.5;
    }
    return value;
}

function getCheckResult(){
    return $("#checkresult").val();
}

function getDataQuality(){
    // console.log("getDataQuality was called");
    const val = $("input[name=dataquality]:checked").val();
     return !isNaN(val) ? Number(val) : 0;
}

function getCircumstances(){
    // console.log("getCircumstances was called");
    const value = $("input[name=circumstances]:checked").toArray().reduce((acc,cur) => acc + Number(cur.value), 0);
    return value;
}

function getRandomHazard(){
    // console.log("getRandomHazard was called");
    return Number($("#randomhazard").val());
}

function getFrom(){
    return Number($("#travelingfrom").val());
}

function getTo(){
    return Number($("#travelingto").val());
}

function getTravelingDC(){
    // console.log("getTravelingDC called!!!!");
    // valueOne = getFrom();
    // valueTwo = getTo();
    // finalValue = travelingDC(valueOne, valueTwo );
    // return finalValue;
    val = travelingDC(getFrom(), getTo())
    return val;
}

function getTravelingTime(){
    val = travelingTime(getFrom(), getTo())
    return val;
}

function travelingDC(from, to){
    // console.log("made it into travelingDC");
    const matrix =[
        [10, 5, 3, 2, 1, 3, 5, 10, 20],
        [5, -5, -4, -3, -2, -1, 0, 10, 25],
        [5, -4, -3, -2, -1, 0, 2, 15, 20],
        [5, -3, -2, -1, 0, 2, 3, 10, 15],
        [10, -2, -1, 0, 0, -1, -2, 10, 15],
        [10, 2, 1, 0, -1, -2, -1, 7, 12],
        [15, 3, 2, 1, 1, 0, 1, 6, 10],
        [20, 18, 15, 12, 10, 7, 3, 0, 25],
        [25, 20, 15, 10, 5, 4, 3, 2, 1],
    ]
    return matrix[from][to];
    // return travelingMatrix[from][to];
}


function travelingTime(from, to){
    const travelTimeMatrix = [
            [12, 18, 24, 48, 72, 96, 120, 144, 168],
            [24, 6, 24, 36, 60 ,84 ,96, 120, 144],
            [48, 24, 12, 24, 48, 72, 96, 120, 96],
            [72, 36, 24, 18, 24, 48, 72, 96, 72],
            [96, 60, 48, 24, 24, 24, 48, 72, 96],
            [120, 84, 72, 48, 24, 36, 24, 48, 72],
            [144, 96, 96, 72 ,48, 24, 48, 24, 60],
            [168, 120, 120, 96, 72, 48, 24, 12, 120],
            [192, 144, 96, 72, 60, 72, 96, 120, 48],
        ];
    return travelTimeMatrix[from][to];
}