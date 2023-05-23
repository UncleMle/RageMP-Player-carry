mp.events.add({
    'player:carry': async (player, target) => {
        player.setVariable('carryInfo', target)
    },
    'player:stopCarry': async (player) => {
        if (player.getVariable('carryInfo')) {
            player.call('detachAll', [player.getVariable('carryInfo')]);
            player.setVariable('carryInfo', null)
            return;
        }
    },
})
