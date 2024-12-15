$(document).ready(function () {
    $("#attackbonus").val(3).on("change input", function () {
        const val = $(this).val();
        $("#baseattackbonus").text(val);
        // console.log("there is a change in value, the change is now", val);
        updateMaximumOnFeatSliders(val);// change the attribute on multiple sliders
    }).trigger('change');

    $("#meleemod_powerattack").on("change input", function () {
        const val = $(this).val();
        $("#span_powerattack").text(val);
    });

    $("#melee_combatexpertise").on("change input", function () {
        const val = $(this).val();
        $("#span_combatexpertise").text(val);
    });

    $("#melee_superiorexpertise").on("change input", function () {
        const val = $(this).val();
        if ($("#melee_combatexpertise").val() > 0) {
            // console.log("I set combat expertise to 0, bossman");
            $("#melee_combatexpertise").val(0);
            $("#span_combatexpertise").text(0);
        }
        $("#span_superiorexpertise").text(val);
    });

    $("#forcemodifier_enhanceability").on("change input", function () {
        const val = $(this).val();
        $("#span_enhanceability").text(val);
    });

    $("#forcemodifier_battlemind").on("change input", function () {
        const val = $(this).val();
        $("#span_battlemind").text(val);
    });

    $("input[name='typeofattack']").on("change input", function () {
        const attacktype = getTypeOfAttack();
        showHide(attacktype)
        uncheckBoxes();
    });

    $("input[name=multiweapon").on("change input", function () {
        const multiwep = getMultiAnswer();
        showHideMulti(multiwep);
        showHideOffHandAttack(multiwep);
    });

    $("#ambidexterity").on("change input", () => { //suspect conflict with lines 13-17
        getOffhandModifer();
    });

    $("#resetaimedattack").on("click", () => {
        uncheckAimedAttack();
    });

    $("#resetmultifire").on("click", () => {
        uncheckMultifire();
    });

    $("#improvedtwowep").on("change input,", () => {
        if ($("#improvedtwowep").is(":checked")) {
            const val = getExtraAttack();
            $("#extraoffhandattack").show();
            $("#span_extraoffhandattack").text(val);
        } else {
            $("#extraoffhandattack").hide()
        }
    });

    $("#rawattribute").on("change input", updateRawAttribute);

    $("#roller").on("click", function () {
        clearOldRolls();
        const roll = rollDice(20, 1)[0];
        const isCrit = isCriticalHit(roll);
        $("<li>").text(`${roll}${isCrit ? ' Crit' : ''}`).appendTo('#pastRolls');
        $(this).get(0).scrollIntoView();
    })

    $(".updatewhenichange").on("change input", function () {
        updateAttackModifiers();
    });

    $("#melee_unbalanceopponent").on("change input", function () {
        const value = getRawAttributeBonus() * -1;
        $("#melee_unbalanceopponent").attr("value", value);
        getAttackModifiers();
    });

    giveNumbers();

});

function showHide(value) {
    if (value === "melee") {
        // uncheckBoxes();
        $("#othermodifier").hide();
        $("#meleemodifier").show();
    } else if (value === "ranged") {
        // uncheckBoxes();
        $("#meleemodifier").hide();
        $("#othermodifier").show();
    } else {
        console.log(value);
    }
}

function showHideMulti(value) {
    if (value === "yes") {
        $("#yesmulti").show();
    } else {
        uncheckMultiBoxes();
        $("#yesmulti").hide();
    }
}

function showHideOffHandAttack(value) {
    if (value === "yes") {
        $("#offhandattack").show();
    } else {
        $("#offhandattack").hide();
    }
}

function uncheckBoxes() {
    $("input[name='miscmodifiers']:checked").prop("checked", false);
    $("input[name='meleemods']:checked").prop("checked", false);
    resetSliders();
    uncheckAimedAttack();
    uncheckMultifire();
    // set slider values to 0 as well.
}

function uncheckAimedAttack() {
    if ($("#aimedattack_kneeling").is(":checked")) {
        $("#aimedattack_kneeling").prop("checked", false);
    } else if ($("#aimedattack_prone").is(":checked")) {
        $("#aimedattack_prone").prop("checked", false);
    } else {
        return;
    } updateAttackModifiers();
}

function uncheckMultifire() {
    if ($("#misc_multifire").is(":checked")) {
        $("#misc_multifire").prop("checked", false);
    } else if ($("#misc_autofire").is(":checked")) {
        // console.log("I'm in the place but I'm not doing anything")
        $("#misc_autofire").prop("checked", false);
    } else {
        // console.log("I returned nothing");
        return;
    } updateAttackModifiers();
}

function uncheckMultiBoxes() {
    $("input[name='multiwep']:checked").prop("checked", false);
    $("input[name='extraextraattack']:checked").prop("checked", false);
}

function resetSliders() {
    // console.log("reset sliders is being called")
    if ($("#melee_combatexpertise").val() > 0) {
        // console.log("combat expertise");
        // console.log("I set combat expertise to 0, bossman");
        $("#melee_combatexpertise").val(0);
        $("#span_combatexpertise").text(0);
    }
    if ($("#meleemod_powerattack").val() > 0) {
        // console.log("power attack");
        // console.log("I set combat expertise to 0, bossman");
        $("#meleemod_powerattack").val(0);
        $("#span_powerattack").text(0);
    }
    if ($("#melee_superiorexpertise").val() > 0) {
        // console.log("superior");
        // console.log("I set combat expertise to 0, bossman");
        $("#melee_superiorexpertise").val(0);
        $("#span_superiorexpertise").text(0);
    }
}

function giveNumbers() {
    // console.log("I ran giveNumbesr");
    updateBaseAttackBonus();
    updateAttackModifiers();
    updateRawAttribute();
    updateOffhand();
    updateEnhanceAbility();
    updateBattlemind();
}

function updateEnhanceAbility() {
    $("#span_enhanceability").text(getBattlemind());
}

function updateBattlemind() {
    $("#span_battlemind").text(getBaseEnhanceAbility());
}

function updateBaseAttackBonus() {
    const value = Number(getBaseAttackBonus());
    $("#baseattackbonus").text(value);
    // console.log("I ran updatebaseattackbonus");
    $("#baseattackbonus").attr("value", value)
    // console.log("I finished and set the attr updatebaseattackbonus the value is now", value);
}

function updateRawAttribute() {
    $("#rawattributetext").text(getRawAttributeBonus());
}

function updateOffhand() {
    const bonus = 0;
    $("#offhandattackbonus").text(bonus);
}

function updateAttackModifiers() {
    const bonus = getAttackModifiers();
    const offhand = getOffhandModifer();
    const extraoffhand = getExtraAttack()
    $("#total").text(bonus);
    $("#offhandattackbonus").text(offhand);
    $("#span_extraoffhandattack").text(extraoffhand);
}

function updateMaximumOnFeatSliders(value) {
    // console.log("I made it to the updatefunction");
    $("#melee_superiorexpertise").attr("max", value);
    $("#melee_superiorexpertise").val(0);
    $("#meleemod_powerattack").attr("max", value);
    $("#meleemod_powerattack").val(0);
}

function clearOldRolls() {
    const $lis = $("#pastRolls > li");
    const liCount = $lis.length;
    if (liCount > 9) {
        $lis.get(0).remove();
    }
}

function getAttackModifiers() {
    let total = 0;
    total += getBaseAttackBonus();
    total += getRawAttributeBonus();
    total += getSizeModifierBonus();
    total += getRangePenalty();
    total += getOtherModifiers();
    total += getMeleeModifiers();
    total += getWeaponProficiency();
    total += getMultiModifiers();
    total += getBaseMultiPenalties();
    total += getStateModifiers();
    total += getBaseEnhanceAbility();
    total += getBattlemind();
    total += getForceModifiers();
    total += (getCombatExpertise() * -1);
    total += (getSuperiorExpertise() * -1);
    total += (getPowerattack() * -1);
    total += getMultishot();
    return total;
}

function getStateModifiers() {
    const val3 = $("input[name='input_conditions']:checked").toArray().reduce((acc, cur) => acc + Number(cur.value), 0);
    return val3;
}

function getBaseAttackBonus() {
    return Number($("#attackbonus").val());
}

function getCombatExpertise() {
    return Number($("#melee_combatexpertise").val());
}

function getSuperiorExpertise() {
    return Number($("#melee_superiorexpertise").val());
}

function getPowerattack() {
    return Number($("#meleemod_powerattack").val());
}

function getBattlemind() {
    return Number($("#forcemodifier_battlemind").val());
}

function getBaseEnhanceAbility() {
    return Number($("#forcemodifier_enhanceability").val());
}

function getRawAttributeBonus() {
    const val = $('#rawattribute').val();
    if (val.length === 0) return 0;
    return Math.floor((val - 10) / 2);
}

function getTypeOfAttack() {
    // const val= $("[name='typeofattack']: checked").val();
    const val = $("input[name='typeofattack']:checked").val();
    // return $("[name='typeofattack'").val();
    return val;
}

function getMultiAnswer() {
    const val = $("input[name='multiweapon']:checked").val();
    return val;
}

function getSizeModifierBonus() {
    return Number($("#sizemodifier").val());
}

function getRangePenalty() {
    const val = Number($("#rangepenalties").val());
    return val * -2;
}

function getWeaponProficiency() {
    const val = Number($("input[name='proficientwithweapon']:checked").val());
    return val;
}

function getOtherModifiers() {
    // console.time("one");
    // let val = 0;
    // $("input[name='miscmodifiers']:checked").each(function (){
    //     val += parseInt($(this).val());
    // });
    // console.timeEnd('one');
    // console.time("two");
    const val3 = $("input[name='miscmodifiers']:checked").toArray().reduce((acc, cur) => acc + Number(cur.value), 0);
    // console.timeEnd('two')
    return val3;
}

function getForceModifiers() {
    const val3 = $("input[name='input_forcemodifier']:checked").toArray().reduce((acc, cur) => acc + Number(cur.value), 0);
    return val3;
}

function getMultishot() {
    const val3 = $("input[name='name_multifire']:checked").toArray().reduce((acc, cur) => acc + Number(cur.value), 0);
    return val3;
}

function getMeleeModifiers() {
    let val = 0;
    $("input[name='meleemods']:checked").each(function () {
        val += parseInt($(this).val());
    });
    return val;
}

function getMultiModifiers() {
    let val = 0;
    $("input[name='multiwep']:checked").each(function () {
        val += parseInt($(this).val());
    });
    return val;
}

function getOffhandModifer() {
    let val = Number(getAttackModifiers() - 4);
    if ($("#ambidexterity").is(":checked")) {
        val = getAttackModifiers();
    }

    return val;
}

function getExtraAttack() {
    const val = Number(getOffhandModifer() - 5);
    return val;
}

function getBaseMultiPenalties() {
    let val = 0;
    const answer = getMultiAnswer();
    if (answer === "yes") {
        val = -6;
    }
    return val
}

function isCriticalHit(roll) {
    const val = $("#threat").val();
    return roll >= val;
}

function rollDice(size, count) {
    let rolls = [];
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * (size - 2) + 1);
        rolls.push(roll);
    }
    return rolls;
}