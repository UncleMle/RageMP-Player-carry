mp.events.add({
    'player:carry': (player, target) => {
        player.setVariable('carryInfo', target)
    },
    'player:stopCarry': (player) => {
        if (player.getVariable('carryInfo')) {
            player.call('detachAll', [player.getVariable('carryInfo')]);
            player.setVariable('carryInfo', null)
            return;
        }
    },
})
