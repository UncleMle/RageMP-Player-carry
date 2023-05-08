mp.events.add({
    'player:carry': async(player, target) => {
        player.setVariable('carryInfo', target)
      },
})
