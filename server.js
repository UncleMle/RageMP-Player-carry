mp.events.add({
    'player:carry': (player, target) => {
        player.setVariable('carryInfo', target)
    },
    'player:stopCarry': (player) => {
        if (player.getVariable('carryInfo')) {
            var target = player.getVariable('carryInfo')
            player.call('detachAll', [target]);
            target.data.dropAnim = true
            player.setVariable('carryInfo', null)
            return;
        }
    },
})
