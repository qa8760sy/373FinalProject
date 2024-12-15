
$(document).ready(function () {
    $("form").on("submit", (e) => e.preventDefault());

    {
        $("#classAttackBonus").on("input", function () {
            const val = $(this).val();
            $("#span_classAttackBonus").text(val);
        }).trigger('input');

        $("#classDefenseBonus").on("input", function () {
            const val = $(this).val();
            $("#span_classDefenseBonus").text(val);
        }).trigger('input');

        $("#strAttribute").on("change", function () {
            const val = Number(Math.floor((($(this).val() - 10) / 2)));
            $("#span_strattributetext").text(val);
        }).trigger('change');

        $("#dexAttribute").on("change", function () {
            const val = Number(Math.floor((($(this).val() - 10) / 2)));
            $("#span_dexattributetext").text(val);
        }).trigger('change');

        $("#combatexpertise").on("input", function () {
            const val = $(this).val();
            $("#span_combatexpertise").text(val);
        }).trigger('input');

        $("#lightsaberdeflect").on("input", function () {
            const val = $(this).val();
            $("#span_lightsaberdeflect").text(val);
        }).trigger('input');

        $("#input_naturalbonus").on("input", function () {
            const val = $(this).val();
            $("#span_naturalbonus").text(val);
        }).trigger('input');

    }

    {

        $("#boxForGrapple").on("change,", () => {
            if ($("#boxForGrapple").is(":checked")) {
                $("#grapple").show();
            } else {
                $("#grapple").hide()
            }
        });

        $("#boxForTwoWeapon").on("change input,", () => {
            $("#twoWeapon").toggle($("#boxForTwoWeapon").is(":checked"));
        });

        $("#boxForImprovedTwoWeapon").on("change input,", () => {
            if ($("#boxForImprovedTwoWeapon").is(":checked")) {
                $("#ImprovedTwoWeapon").show();
            } else {
                $("#ImprovedTwoWeapon").hide()
            }
        });

    }

    $(".updatewhenichange").on("change", function () {
        updateEverything();
    });

    // $("input[name='input_defense_dodge']").on('change', updateDefense);

});

let defaults = { meleeAttack: 0, rangedAttack: 0, defense: 0, grapple: 0, twoWeapon: 0, improvedTwoWeapon: 0 };
let totals = {};
let attributes = { strength: 0, dexterity: 0 };

const $nameMeBetter = $("#totaldefense, #fightingdefensively");
$nameMeBetter.on('change', function () {
    console.log("name me better called")
    $nameMeBetter.not(this).prop('checked', false);
});

const $coverBonusId = $("#input_cover_quarter", "#input_cover_half", "#input_cover_threeqtr", "#input_cover_ninetenths");
$coverBonusId.on('change', function () {
    console.log('cover bonus id I think');
    $coverBonusId.not(this).prop('checked', false);
})

function getInputVal(id) {
    const value = Number($(`#${id}`).val());
    return isNaN(value) ? 0 : value;
}

function resetToDefault() {
    Object.keys(totals).forEach((key) => totals[key] = 0);
    attributes.dexterity = 0;
    attributes.strength = 0;
}

function getAttributes() {
    const attributes = getAttributeModifiers();
    return {
        strength: getInputStrength() + (attributes.strength ?? 0),
        dexterity: getInputDexterity() + (attributes.dexterity ?? 0),
    }
}

function updateEverything() {
    resetToDefault();
    attributes = getAttributes();
    let _totals = Object.assign({}, defaults);
    const modifiers = getModifiers();
    _totals = applyModifiers(_totals, modifiers);
    // updateStats();    
    _totals = applyModifiers(_totals, getDefenseModifiers());
    // updateStatus();
    // getMeleeAttack();
    totals = _totals;
    updateTotalsSpans();
    console.log(totals);
}

function updateTotalsSpans() {
    updateTotalDefense();
}

function getDodgeBonuses() {
    let val = $("input[name='input_defense_dodge']:checked").toArray().reduce((acc, cur) => acc + Number(cur.value), 0);
    // console.log(val);    
    // console.log(totals.defense, "I am total defense but different");
    return isNaN(val) ? 0 : val;
}

function getDefenseModifiers() {
    let total = 10;
    total += getClassDefense();
    total += getDexterity();
    total += getSizeModifier();
    total += getDodgeBonuses();
    total += getCoverBonus();
    total += getLightsaberDeflect();
    total += getNaturalBonus();

    return { defense: total };
}

function updateTotalDefense() {
    $("#span_totalDefense").text(totals.defense);
}

function sumObjectProperties(objects) {
    const result = {};
    for (const object of objects) {
        for (const [key, value] of Object.entries(object)) {
            if (result[key] === undefined) {
                result[key] = value;
            } else {
                result[key] += value;
            }
        }
    }
    return result;
}

function applyModifiers(totals, modifiers) {
    const t = Object.assign({}, totals);
    Object.keys(modifiers).forEach((key) => {
        t[key] += modifiers[key];
    });

    if (isBlinded()) t.dexterity = 3;

    return t;
}
// run everything through the next two functions based on parameters
function getAttributeModifiers() {
    // for strength and dexterity
    const results = sumObjectProperties([
        getEntangledModifiers(),
    ]);
    return {
        strength: results.strength,
        dexterity: results.dexterity,
    };

}

function getModifiers() {
    // only for things that don't effect strength and dexterity
    const results = sumObjectProperties([
        getEntangledModifiers(),
        getCombatExpertise(),
    ]);

    delete results.strength;
    delete results.dexterity;

    return results;
}

function getCombatExpertise() {
    if ($("#combatexpertise").val() != 0) {
        return {
            meleeAttack: getInputVal("combatexpertise"),
            rangedAttack: getInputVal("combatexpertise"),
            defense: getInputVal("combatexpertise"),
        }
    }
    return {};
}

function getEntangledModifiers() {
    //  -2 melee attack & ranged attack, -4 dex
    if ($("#conditions_entangled").is(":checked")) {
        return {
            meleeAttack: -2,
            rangedAttack: -2,
            dexterity: -4,
        }
    }

    return {};
}

function isBlinded() {
    return $("#conditions_blinded").is(":checked");
}

function getCoverBonus() {
    if ($("input[name='coverbonus']:checked").prop('checked') == true) {
        return Number($("input[name='coverbonus']:checked").val());
    } else {
        return Number(0);
    }
}

function getNaturalBonus() {
    return Number($("#input_naturalbonus").val());
}

function getLightsaberDeflect() {
    return getInputVal("lightsaberdeflect");
}

function getClassDefense() {
    return getInputVal("classDefenseBonus");
}

function getClassAttack() {
    return getInputVal("classAttackBonus");
}

function getSizeModifier() {
    return getInputVal("sizemodifier");
}

function getInputDexterity() {
    return (getInputVal("dexAttribute") - 10) / 2;
}

function getInputStrength() {
    return (getInputVal("strAttribute") - 10) / 2;
}

function getStrength() {
    return attributes.strength;
}

function getDexterity() {
    return attributes.dexterity;
}

