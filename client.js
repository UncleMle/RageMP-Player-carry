class playerCarry {
    constructor() {
        this.target = null;

        mp.events.addDataHandler({
            'carryInfo': function (entity, value) {
                if(entity.type == 'player') {
                    if(value != null && value.type == 'player') {
                        mp.players.forEachInStreamRange(() => {
                            mp.game.streaming.requestAnimDict(`nm`);
                            mp.game.streaming.requestAnimDict(`missfinale_c2mcs_1`);
                            value.taskPlayAnim("nm", "firemans_carry", 8.0, 1.0, -1, 33, 0.0, true, true, true);
                            entity.taskPlayAnim("missfinale_c2mcs_1", "fin_c2_mcs_1_camman", 8.0, 1.0, -1, 0 + 32 + 16, 0.0, false, false, false)
                        })
                    }
                    else {
                        entity.detach(true, false)
                        entity.clearTasks()
                     }
                }
            }
        })


        mp.events.add({
            'detachAll': (entity) => {
                if(entity.type == 'player') {
                    var target = entity.getVariable('carryInfo')
                    if(entity) { entity.detach(true, false), entity.clearTasks() }
                    setTimeout(async() => {
                        if(!target) return;
                        target.detach(true, false)
                        target.clearTasks()
                        mp.players.forEachInStreamRange(() => {
                            mp.game.streaming.requestAnimDict(`combat@damage@writheidle_a`);
                            target.taskPlayAnim(`combat@damage@writheidle_a`, `writhe_idle_a`, 8.0, 1.0, -1, 1, 1.0, false, false, false);
                        })
                    }, 500);
                }
            },
            'entityStreamIn': (entity) => {
                if(entity.type == 'player' && entity.getVariable('carryInfo')) {
                    var target = entity.getVariable('carryInfo')
                    if(target && entity) {
                        mp.game.streaming.requestAnimDict(`nm`);
                        mp.game.streaming.requestAnimDict(`missfinale_c2mcs_1`);
                        target.taskPlayAnim("nm", "firemans_carry", 8.0, 1.0, -1, 33, 0.0, true, true, true);
                        entity.taskPlayAnim("missfinale_c2mcs_1", "fin_c2_mcs_1_camman", 8.0, 1.0, -1, 0 + 32 + 16, 0.0, false, false, false)
                    }
                }
            },
            'render': () => {
                mp.players.forEachInStreamRange((ps) => {
                    if(ps.getVariable('injured') == true && ps.handle != mp.players.local.handle && !mp.gui.cursor.visible &&!mp.players.local.getVariable('carryInfo') && !mp.players.local.getVariable('injured')) {
                        var vdist = Math.floor(mp.game.system.vdist(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, ps.position.x, ps.position.y, ps.position.z))
                        if(vdist > 1) { return; }
                        var rootBone = ps.getBoneCoords(0, 0, 0, 0);
                        this.target = mp.raycasting.testPointToPoint(rootBone, mp.players.local.position, [mp.players.local], [1, 16]);
                        if(mp.players.local.getVariable('adminDuty') == true) {mp.game.graphics.drawLine(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, this.target.position.x, this.target.position.y, this.target.position.z, 255, 0, 0, 255)}
                        mp.game.graphics.drawText(`~c~[~w~E~c~]~w~ Carry ${ps.nickName ? ps.nickName : `Player`}`, [rootBone.x, rootBone.y, rootBone.z], {
                            scale: [0.3, 0.3],
                            outline: false,
                            color: [255, 255, 255, 255],
                            font: 4
                        });
                    }
                })
            }
        })

        mp.keys.bind(69, true, () => {
            if(!mp.gui.cursor.visible && this.target.entity.getVariable('injured') == true && this.target.entity != mp.players.local && !mp.players.local.getVariable('carryInfo') && !mp.players.local.getVariable('injured')) {
                //mp.gui.chat.push(`${this.target.entity.remoteId}`)
                if(mp.players.local.vehicle) { return }
                var vdist = Math.floor(mp.game.system.vdist(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, this.target.entity.position.x, this.target.entity.position.y, this.target.entity.position.z))
                if(vdist > 1) { return; }
                mp.events.call('notifCreate', `~w~Now carrying ${this.target.entity.nickName ? this.target.entity.nickName : 'Player'} use ~y~'X'~w~ to cancel`)
                mp.events.callRemote('player:carry', this.target.entity)
            }
        });
        
        mp.keys.bind(88, false, () => {
        if(mp.players.local.getVariable('carryInfo')) {
        mp.events.callRemote('player:stopCarry');
        mp.events.call('notifCreate', `~w~Dropped player ~g~successfully`)
        return;
        }
        })

        setInterval(() => {
            mp.players.forEachInStreamRange((ps) => { if(ps.getVariable('carryInfo')) {
                var target = ps.getVariable('carryInfo')
                if(target && ps && ps != target) { // Ped handle being same as target causes client crash
                    target.attachTo(ps.handle, 0, 0.15, 0.27, 0.63, 0.5, 0.5, 0.0, false, false, false, false, 2, false);

                    element.ped = mp.peds.new(target.model, ps.position, 0);
                    mp.game.invoke("0xE952D6431689AD9A", target.handle, element.ped.handle);
                    element.ped.attachTo(ps.handle, 0, 0.25, 0.07, 0.63, 0.5, 0.5, 0.0, false, false, false, false, 2, false);
                    ps.attachTo(element.ped.handle, 0, 0.15, 0.27, 0.63, 0.5, 0.5, 0.0, false, false, false, false, 2, false);
                 }
             } else { ps.detach(true, false) } })
        }, 500);
    }
}
new playerCarry()
