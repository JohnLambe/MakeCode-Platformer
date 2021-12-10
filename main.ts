namespace SpriteKind {
    export const Enemy_Chaser = SpriteKind.create()
    export const Enemy_Horiz = SpriteKind.create()
    export const InventoryItem = SpriteKind.create()
    export const Switch = SpriteKind.create()
    export const Door = SpriteKind.create()
}
namespace StatusBarKind {
    export const NewStatusBarKind = StatusBarKind.create()
}
/**
 * TO DO:
 * 
 * Key card.
 * 
 * - Key card door closes automatically after a time.
 * 
 * - Water.
 * 
 * - Lives.
 * 
 * - Animations: Player left; Enemy_Horiz.
 * 
 * - Some images.
 * 
 * - Synchronise the state of all switches with same ID.
 * 
 * - PickUp that just increases score
 * 
 * - Water..
 * 
 * - Doors open initially if Wall set initially.
 * 
 *   - Closing doors.
 * 
 * - More objects:
 * 
 *   - aqualung; gun; explosive;
 * 
 * - Enemy_Horiz turns at point indicated by placeholder character.
 * 
 * Possible future features:
 * 
 * - Vehicles.
 * 
 * - Teleporters.
 * 
 * - Sliding blocks - pushed sideways, fall if tile below is removed.
 * 
 * - Earth (as in Repton).
 * 
 * - Bucket: Can be filled with water. Extinguishes fire.
 * 
 * - Inventory object that can be stood on.
 * 
 * - Food.
 * 
 * - Oxygen (needed to survive in  areas indicated as external).
 * 
 * - Enemy like Repton Spirit.
 */
/**
 * Platform game.
 * 
 * Some of the graphics are adapted from kenney.nl.
 * 
 * The topmost and bottommost rows of each tilemap should be 'Wall' tiles (so that the player's character is not obscured by the UI).
 */
// Called by handler on handling use of an object (to prevent it from being handled again).
function inv_UseObjectHandled () {
    inv_UseObject = Sprite_null()
}
// initialise all keys with a given ID (there can be multiple)
function Key_InitKey (keyID: string, displayName: string, locations: any[]) {
    for (let value of locations) {
        mySprite = sprites.create(assets.image`key`, SpriteKind.InventoryItem)
        grid.place(mySprite, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        sprites.setDataString(mySprite, "invType", "key")
        sprites.setDataString(mySprite, "displayName", displayName)
        sprites.setDataString(mySprite, "keyID", keyID)
    }
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    Player_DetermineOnLadder()
    if (playerVerticalMove) {
    	
    } else if (playerSprite.isHittingTile(CollisionDirection.Bottom)) {
        playerSprite.vy = -90
        music.jumpUp.play()
    }
})
// Reset/initialise the tilemap and sprites based on the variable 'level'.
function StartLevel () {
    GRIDCELLSIZE = 16
    scene.setBackgroundColor(8)
    if (level == 1) {
        tiles.setTilemap(tilemap`level_1`)
    } else if (level == 2) {
        tiles.setTilemap(tilemap`level_2`)
    } else {
        tiles.setTilemap(tilemap`level0`)
    }
    Reset()
    Player_init()
    Enemy_Chaser_init()
    Enemy_Horiz_init()
    inv_Init()
    setSolid()
    Key_init()
    Switch_init()
    healthPickUp_init()
    for (let value of tiles.getTilesByType(assets.tile`myTile`)) {
        grid.place(sprites.create(assets.image`item1`, SpriteKind.InventoryItem), value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    for (let value of tiles.getTilesByType(assets.tile`myTile0`)) {
        grid.place(sprites.create(assets.image`bottle`, SpriteKind.InventoryItem), value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    // Full screen because camera position is not set to the player yet.
    game.showLongText("Level " + level, DialogLayout.Full)
}
// NOT USED
function inv_Set (slot: number, pickUpSprite: Sprite) {
    index = inv_GetEmptySlotIndex()
    if (index >= 0) {
        invItem = inv_ItemAtIndex(inv_Selected)
        sprites.setDataSprite(invItem, "sprite", pickUpSprite)
        playerSprite.sayText("key A", 1000, true)
    }
}
// Returns the first empty inventory slot, or -1 if there is none.
function inv_GetEmptySlotIndex () {
    for (let index = 0; index <= inv_MAX; index++) {
        if (inv_SpriteAtIndex(index) == Sprite_null()) {
            return index
        }
    }
    return -1
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    inv_SelectNext()
})
function inv_SpriteAtIndex (index: number) {
    return sprites.readDataSprite(inv_ItemAtIndex(index), "sprite")
}
// Returns a null sprite
// (MakeCode Blocks doesn't provide a null literal.)
function Sprite_null () {
    return sprites.readDataSprite(playerSprite, "null")
}
// Make a sprite not visible in the world (by placing it at a location that will never be seen).
function Sprite_Hide (sprite: Sprite) {
    grid.remove(sprite)
    sprite.x = -10000
}
// Returns the sprite at the given grid coordinates. nullable.
function Grid_SpriteAtLocation (x: number, y: number) {
    x = Math.floor(x)
    y = Math.floor(y)
    list = grid.getSprites(tiles.getTileLocation(x, y))
    // null of correct type.
    if (list != grid.getSprites(tiles.getTileLocation(-1, -1))) {
        return list[0]
    }
    return Sprite_null()
}
// Initialise the Key/Door system.
// Requires Inventory System (Inv_), which must be initialised first.
function Key_init () {
    // Remove any existing Doors.
    // Keys should have been removed when the Inventory System was initialised.
    for (let value of sprites.allOfKind(SpriteKind.Door)) {
        value.destroy()
    }
    Key_InitKey("1", "key 1", tiles.getTilesByType(assets.tile`key_1`))
    Key_InitKey("2", "key 2", tiles.getTilesByType(assets.tile`key_0`))
    Key_InitKey("3", "key 3", tiles.getTilesByType(assets.tile`key_2`))
    Key_InitKey("4", "key 4", tiles.getTilesByType(assets.tile`key_3`))
    Key_InitKey("5", "keycard 5", tiles.getTilesByType(assets.tile`keycard_t`))
    Key_InitDoor("1", tiles.getTilesByType(tiles.util.door0), assets.image`door_closed`)
    Key_InitDoor("2", tiles.getTilesByType(tiles.util.door2), assets.image`door_closed`)
    Key_InitDoor("3", tiles.getTilesByType(tiles.util.door8), assets.image`door_closed`)
    Key_InitDoor("4", tiles.getTilesByType(tiles.util.door10), assets.image`door_closed`)
    Key_InitDoor("5", tiles.getTilesByType(tiles.util.door5), assets.image`door2_closed`)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    inv_UseObject2()
})
// lose health
scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.hazardLava0, function (sprite, location) {
    playerHealth += -1
    music.buzzer.play()
    if (sprites.readDataString(playerSprite, "effect") != "fire") {
        playerSprite.startEffect(effects.fire, 1000)
        sprites.setDataString(playerSprite, "effect", "fire")
    }
})
controller.player2.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function () {
    inv_Drop()
})
// Initialise the switch system.
function Switch_init () {
    // Remove any existing switches (from previous game/level).
    for (let value of sprites.allOfKind(SpriteKind.Switch)) {
        value.destroy()
    }
    Switch_InitSwitch("A", tiles.getTilesByType(assets.tile`lever_A`))
    Switch_InitSwitch("B", tiles.getTilesByType(assets.tile`lever_B`))
    Switch_InitSwitch("C", tiles.getTilesByType(assets.tile`lever_C`))
    Switch_InitSwitch("D", tiles.getTilesByType(assets.tile`lever_D`))
}
// If there is a switch/lever at the player, toggle it and return true, otherwise return false.
function Switch_TryToggle () {
    mySprite = Grid_SpriteAtLocation(Math.floor(playerSprite.x) / GRIDCELLSIZE, Math.floor(playerSprite.y) / GRIDCELLSIZE)
    if (mySprite != Sprite_null() && mySprite.kind() == SpriteKind.Switch) {
        Switch_Toggle(mySprite)
        music.knock.play()
        return true
    } else {
        return false
    }
}
function healthPickUp_init () {
    for (let value of tiles.getTilesByType(assets.tile`health0`)) {
        mySprite = sprites.create(assets.image`health`, SpriteKind.InventoryItem)
        grid.place(mySprite, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        sprites.setDataString(mySprite, "invType", "health")
        sprites.setDataString(mySprite, "displayName", "health")
        sprites.changeDataNumberBy(mySprite, "health", 50)
    }
}
// Select next non-empty slot.
function inv_SelectNext () {
    inv_SelectNext1()
    inv_EnsureSelection()
}
// If current selected slot is empty, select next non-empty one (if there is one).
function inv_EnsureSelection () {
    index = inv_Selected
    while (inv_SpriteAtIndex(inv_Selected) == Sprite_null()) {
        inv_SelectNext1()
        // If we've looped back to where we started, exit to prevent an infinite loop.
        if (inv_Selected == index) {
            return
        }
    }
}
function Player_DetermineOnLadder () {
    playerUnderWater = playerSprite.tileKindAt(TileDirection.Center, assets.tile`water`)
    playerInWater = playerUnderWater || playerSprite.tileKindAt(TileDirection.Center, sprites.dungeon.hazardWater)
    playerVerticalMove = playerSprite.tileKindAt(TileDirection.Center, assets.tile`ladder`) || playerInWater || playerSprite.tileKindAt(TileDirection.Center, sprites.dungeon.hazardLava0)
    if (playerUnderWater) {
        if (sprites.readDataString(playerSprite, "effect") != "bubbles") {
            playerSprite.startEffect(effects.bubbles)
            sprites.setDataString(playerSprite, "effect", "bubbles")
        }
    } else {
        effects.clearParticles(playerSprite)
        sprites.setDataString(playerSprite, "effect", "")
    }
}
// lose health
scene.onOverlapTile(SpriteKind.Player, assets.tile`spikes`, function (sprite, location) {
    playerHealth += -2
    scene.cameraShake(2, 100)
    music.buzzer.play()
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`finish`, function (sprite, location) {
    // count remaining treasure.
    value = tiles.getTilesByType(assets.tile`treasure`).length
    if (value == 0) {
        game.over(true, effects.confetti)
    } else {
        playerSprite.sayText("" + value + " remaining", 2000, false)
    }
})
// Returns true if the used object is of the given type.
function inv_UsedObjectIs (invType: string) {
    return sprites.readDataString(inv_UseObject, "invType") == invType
}
// initialise all doors with a given ID (there can be multiple)
function Key_InitDoor (keyID: string, locations: any[], image2: Image) {
    for (let value of locations) {
        mySprite = sprites.create(image2, SpriteKind.Door)
        grid.place(mySprite, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        tiles.setWallAt(value, true)
        sprites.setDataString(mySprite, "keyID", keyID)
    }
}
// Initialise the inventory system.
function inv_Init () {
    for (let value of sprites.allOfKind(SpriteKind.InventoryItem)) {
        value.destroy()
    }
    inv_SelectionBox = sprites.create(assets.image`inventorySelection`, SpriteKind.StatusBar)
    inv_SelectionBox.setFlag(SpriteFlag.RelativeToCamera, true)
    inv_SelectionBox.setFlag(SpriteFlag.Ghost, true)
    // Behind inventory items but in front of box.
    inv_SelectionBox.z = 10005
    inv_Box = sprites.create(assets.image`inventoryBox`, SpriteKind.StatusBar)
    inv_Box.setPosition(33, scene.screenHeight() - 8)
    inv_Box.setFlag(SpriteFlag.RelativeToCamera, true)
    inv_Box.setFlag(SpriteFlag.Ghost, true)
    inv_Box.z = 10000
    // All inventory slots.
    inventory = []
    // Index of selected inventory item.
    inv_Selected = 0
    // Index of last inventory slot.
    inv_MAX = 3
    // Initialise all inventory slots to empty.
    for (let index = 0; index <= inv_MAX; index++) {
        mySprite = sprites.create(assets.image`blank`, SpriteKind.StatusBar)
        mySprite.setPosition(9 + 16 * index, scene.screenHeight() - 10)
        mySprite.setFlag(SpriteFlag.RelativeToCamera, true)
        mySprite.setFlag(SpriteFlag.Ghost, true)
        mySprite.z = 10010
        inventory.push(mySprite)
    }
    inv_SelectionBox.setPosition(mySprite.x, mySprite.y + 2)
}
// Drop the selected inventory item.
function inv_Drop () {
    // You can't drop items while jumping/falling.
    if (playerOnGround) {
        invItem = inv_ItemAtIndex(inv_Selected)
        if (invItem != Sprite_null()) {
            mySprite = sprites.readDataSprite(invItem, "sprite")
            // If there is an item in the selected slot.aaaaaaaaaaaaaaaadadaaaaaaaaaaaaaaa
            if (mySprite != Sprite_null()) {
                grid.place(mySprite, tiles.getTileLocation(Math.floor(playerSprite.x / GRIDCELLSIZE), Math.floor(playerSprite.y / GRIDCELLSIZE)))
                playerSprite.sayText(sprites.readDataString(mySprite, "displayName"), 1000, false)
                sprites.setDataSprite(invItem, "sprite", Sprite_null())
                invItem.setImage(assets.image`blank`)
                music.playTone(262, music.beat(BeatFraction.Half))
                inv_EnsureSelection()
                return
            }
        }
        music.playTone(139, music.beat(BeatFraction.Half))
    }
}
controller.player2.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function () {
    inv_PickUp()
})
// Set switch state and image.
function Switch_Set (switchSprite: Sprite, state: boolean) {
    sprites.setDataBoolean(switchSprite, "switchState", state)
    if (state) {
        switchSprite.setImage(assets.image`switch_on`)
    } else {
        switchSprite.setImage(assets.image`switch_off`)
    }
    // The currently activated switch.
    Switch_Active = switchSprite
}
// Increase health and remove tile.
scene.onOverlapTile(SpriteKind.Player, assets.tile`health`, function (sprite, location) {
    music.powerUp.play()
    playerHealth = Math.constrain(playerHealth + 25, 0, 100)
    tiles.setTileAt(location, assets.tile`transparency16`)
})
controller.player2.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed, function () {
    inv_SelectNext()
})
// Initialise an individual switch or all switches with a givenID.
function Switch_InitSwitch (switchID: string, locations: any[]) {
    for (let value of locations) {
        mySprite = sprites.create(assets.image`switch_on`, SpriteKind.Switch)
        grid.place(mySprite, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        sprites.setDataString(mySprite, "switchID", switchID)
        Switch_Set(mySprite, tiles.tileIsWall(value))
        tiles.setWallAt(value, false)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy_Horiz, function (sprite, otherSprite) {
    playerHealth += -3
    music.zapped.play()
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(playerVerticalMove)) {
        item = Grid_SpriteAtLocation(playerSprite.x / GRIDCELLSIZE, playerSprite.y / GRIDCELLSIZE)
        if (item != Sprite_null() && item.kind() == SpriteKind.InventoryItem) {
            inv_PickUp()
        } else if (Switch_TryToggle()) {
        	
        } else {
            inv_Drop()
        }
    }
})
function Switch_Handled () {
    Switch_Active = Sprite_null()
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    value = game.askForNumber("Level", 2)
    if (value >= 0) {
        level = value
        StartLevel()
    }
})
controller.player2.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed, function () {
	
})
// score points and remove tile
scene.onOverlapTile(SpriteKind.Player, assets.tile`treasure`, function (sprite, location) {
    music.baDing.play()
    info.changeScoreBy(10)
    tiles.setTileAt(location, assets.tile`transparency16`)
})
function Switch_Toggle (switchSprite: Sprite) {
    Switch_Set(switchSprite, !(sprites.readDataBoolean(switchSprite, "switchState")))
}
function Reset () {
    info.setLife(3)
    info.setScore(0)
    for (let value of grid.allSprites()) {
        grid.remove(value)
    }
    for (let value of sprites.allOfKind(SpriteKind.Player)) {
        value.destroy()
    }
    for (let value of sprites.allOfKind(SpriteKind.Projectile)) {
        value.destroy()
    }
    for (let value of sprites.allOfKind(SpriteKind.Food)) {
        value.destroy()
    }
}
// Enemy_Horiz
function Enemy_Horiz_init () {
    for (let value of sprites.allOfKind(SpriteKind.Enemy_Horiz)) {
        value.destroy()
    }
    for (let value of tiles.getTilesByType(assets.tile`start_Enemy_Horiz`)) {
        mySprite = sprites.create(assets.image`Enemy_Horiz`, SpriteKind.Enemy_Horiz)
        tiles.placeOnTile(mySprite, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
}
function inv_UseObject2 () {
    inv_UseObject = inv_SpriteAtIndex(inv_Selected)
}
function inv_ItemAtIndex (index: number) {
    return inventory[index]
}
// Enemy_Chaser
function Enemy_Chaser_init () {
    for (let value of sprites.allOfKind(SpriteKind.Enemy_Chaser)) {
        value.destroy()
    }
    for (let value of tiles.getTilesByType(assets.tile`start_Chaser`)) {
        mySprite = sprites.create(assets.image`Enemy_Chaser`, SpriteKind.Enemy_Chaser)
        tiles.placeOnTile(mySprite, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        characterAnimations.loopFrames(
        mySprite,
        [img`
            . . f f f . . . . . . . . f f f 
            . f f c c . . . . . . f c b b c 
            f f c c . . . . . . f c b b c . 
            f c f c . . . . . . f b c c c . 
            f f f c c . c c . f c b b c c . 
            f f c 3 c c 3 c c f b c b b c . 
            f f b 3 b c 3 b c f b c c b c . 
            . c b b b b b b c b b c c c . . 
            . c 1 b b b 1 b b c c c c . . . 
            c b b b b b b b b b c c . . . . 
            c b c b b b c b b b b f . . . . 
            f b 1 f f f 1 b b b b f c . . . 
            f b b b b b b b b b b f c c . . 
            . f b b b b b b b b c f . . . . 
            . . f b b b b b b c f . . . . . 
            . . . f f f f f f f . . . . . . 
            `,img`
            . . f f f . . . . . . . . . . . 
            f f f c c . . . . . . . . f f f 
            f f c c . . c c . . . f c b b c 
            f f c 3 c c 3 c c f f b b b c . 
            f f b 3 b c 3 b c f b b c c c . 
            . c b b b b b b c f b c b c c . 
            . c b b b b b b c b b c b b c . 
            c b 1 b b b 1 b b b c c c b c . 
            c b b b b b b b b c c c c c . . 
            f b c b b b c b b b b f c . . . 
            f b 1 f f f 1 b b b b f c c . . 
            . f b b b b b b b b c f . . . . 
            . . f b b b b b b c f . . . . . 
            . . . f f f f f f f . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `,img`
            . . . . . . . . . . . . . . . . 
            . . c c . . c c . . . . . . . . 
            . . c 3 c c 3 c c c . . . . . . 
            . c b 3 b c 3 b c c c . . . . . 
            . c b b b b b b b b f f . . . . 
            c c b b b b b b b b f f . . . . 
            c b 1 b b b 1 b b c f f f . . . 
            c b b b b b b b b f f f f . . . 
            f b c b b b c b c c b b b . . . 
            f b 1 f f f 1 b f c c c c . . . 
            . f b b b b b b f b b c c . . . 
            c c f b b b b b c c b b c . . . 
            c c c f f f f f f c c b b c . . 
            . c c c . . . . . . c c c c c . 
            . . c c c . . . . . . . c c c c 
            . . . . . . . . . . . . . . . . 
            `,img`
            . f f f . . . . . . . . f f f . 
            f f c . . . . . . . f c b b c . 
            f c c . . . . . . f c b b c . . 
            c f . . . . . . . f b c c c . . 
            c f f . . . . . f f b b c c . . 
            f f f c c . c c f b c b b c . . 
            f f f c c c c c f b c c b c . . 
            . f c 3 c c 3 b c b c c c . . . 
            . c b 3 b c 3 b b c c c c . . . 
            c c b b b b b b b b c c . . . . 
            c b 1 b b b 1 b b b b f c . . . 
            f b b b b b b b b b b f c c . . 
            f b c b b b c b b b b f . . . . 
            . f 1 f f f 1 b b b c f . . . . 
            . . f b b b b b b c f . . . . . 
            . . . f f f f f f f . . . . . . 
            `],
        100,
        characterAnimations.rule(Predicate.MovingLeft)
        )
        characterAnimations.loopFrames(
        mySprite,
        [img`
            f f f . . . . . . . . f f f . . 
            c b b c f . . . . . . c c f f . 
            . c b b c f . . . . . . c c f f 
            . c c c b f . . . . . . c f c f 
            . c c b b c f . c c . c c f f f 
            . c b b c b f c c 3 c c 3 c f f 
            . c b c c b f c b 3 c b 3 b f f 
            . . c c c b b c b b b b b b c . 
            . . . c c c c b b 1 b b b 1 c . 
            . . . . c c b b b b b b b b b c 
            . . . . f b b b b c b b b c b c 
            . . . c f b b b b 1 f f f 1 b f 
            . . c c f b b b b b b b b b b f 
            . . . . f c b b b b b b b b f . 
            . . . . . f c b b b b b b f . . 
            . . . . . . f f f f f f f . . . 
            `,img`
            . . . . . . . . . . . f f f . . 
            f f f . . . . . . . . c c f f f 
            c b b c f . . . c c . . c c f f 
            . c b b b f f c c 3 c c 3 c f f 
            . c c c b b f c b 3 c b 3 b f f 
            . c c b c b f c b b b b b b c . 
            . c b b c b b c b b b b b b c . 
            . c b c c c b b b 1 b b b 1 b c 
            . . c c c c c b b b b b b b b c 
            . . . c f b b b b c b b b c b f 
            . . c c f b b b b 1 f f f 1 b f 
            . . . . f c b b b b b b b b f . 
            . . . . . f c b b b b b b f . . 
            . . . . . . f f f f f f f . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `,img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . c c . . c c . . 
            . . . . . . c c c 3 c c 3 c . . 
            . . . . . c c c b 3 c b 3 b c . 
            . . . . f f b b b b b b b b c . 
            . . . . f f b b b b b b b b c c 
            . . . f f f c b b 1 b b b 1 b c 
            . . . f f f f b b b b b b b b c 
            . . . b b b c c b c b b b c b f 
            . . . c c c c f b 1 f f f 1 b f 
            . . . c c b b f b b b b b b f . 
            . . . c b b c c b b b b b f c c 
            . . c b b c c f f f f f f c c c 
            . c c c c c . . . . . . c c c . 
            c c c c . . . . . . . c c c . . 
            . . . . . . . . . . . . . . . . 
            `,img`
            . f f f . . . . . . . . f f f . 
            . c b b c f . . . . . . . c f f 
            . . c b b c f . . . . . . c c f 
            . . c c c b f . . . . . . . f c 
            . . c c b b f f . . . . . f f c 
            . . c b b c b f c c . c c f f f 
            . . c b c c b f c c c c c f f f 
            . . . c c c b c b 3 c c 3 c f . 
            . . . c c c c b b 3 c b 3 b c . 
            . . . . c c b b b b b b b b c c 
            . . . c f b b b b 1 b b b 1 b c 
            . . c c f b b b b b b b b b b f 
            . . . . f b b b b c b b b c b f 
            . . . . f c b b b 1 f f f 1 f . 
            . . . . . f c b b b b b b f . . 
            . . . . . . f f f f f f f . . . 
            `],
        100,
        characterAnimations.rule(Predicate.MovingRight)
        )
    }
}
// Move selection to next slot even if it is empty.
function inv_SelectNext1 () {
    inv_Selected += 1
    if (inv_Selected > inv_MAX) {
        inv_Selected = 0
    }
}
// Player, including status bars.
function Player_init () {
    SPEED = 60
    playerHealth = 100
    playerSprite = sprites.create(assets.image`PlayerSprite`, SpriteKind.Player)
    playerSprite.ay = 100
    scene.cameraFollowSprite(playerSprite)
    tiles.placeOnRandomTile(playerSprite, assets.tile`startPlayer`)
    playerSprite.z = 100
    for (let value of tiles.getTilesByType(assets.tile`startPlayer`)) {
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    for (let value of sprites.allOfKind(SpriteKind.StatusBar)) {
        value.destroy()
    }
    playerSprite.fx = 20
    statusbar = statusbars.create(20, 4, StatusBarKind.Energy)
    statusbar.positionDirection(CollisionDirection.Bottom)
    statusbar.setOffsetPadding(0, 10)
    statusbar.setBarBorder(1, 15)
    healthStatusBar = statusbars.create(20, 4, StatusBarKind.Health)
    healthStatusBar.positionDirection(CollisionDirection.Bottom)
    healthStatusBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
    healthStatusBar.setOffsetPadding(0, 4)
    healthStatusBar.setBarBorder(1, 15)
    characterAnimations.loopFrames(
    playerSprite,
    assets.animation`player`,
    100,
    characterAnimations.rule(Predicate.MovingLeft, Predicate.Moving)
    )
    characterAnimations.loopFrames(
    playerSprite,
    [img`
        . . . f f f f f . . . . . 
        . f f f f f f f f f . . . 
        . f f f f f f c f f f . . 
        f f f f c f f f c f f . . 
        f c f f c c f f f c c f f 
        f c c f f f f e f f f f f 
        f f f f f f f e e f f f . 
        f f e e f b f e e f f . . 
        . f e 4 e 1 f 4 4 f . . . 
        . f f f e 4 4 4 4 f . . . 
        . . f e e e e e f f . . . 
        . . e 4 4 e 7 7 7 f . . . 
        . . e 4 4 e 7 7 7 f . . . 
        . . f e e f 6 6 6 f . . . 
        . . . f f f f f f . . . . 
        . . . . f f f . . . . . . 
        `,img`
        . . . . . . . . . . . . . 
        . . . f f f f f f . . . . 
        . f f f f f f f f f . . . 
        . f f f f f f c f f f . . 
        f f f f c f f f c f f f . 
        f c f f c c f f f c c f f 
        f c c f f f f e f f f f f 
        f f f f f f f e e f f f . 
        f f e e f b f e e f f . . 
        . f e 4 e 1 f 4 4 f f . . 
        . f f f e e 4 4 4 f . . . 
        . . f e 4 4 e e f f . . . 
        . . f e 4 4 e 7 7 f . . . 
        . f f f e e f 6 6 f f . . 
        . f f f f f f f f f f . . 
        . . f f . . . f f f . . . 
        `,img`
        . . . . . . . . . . . . . 
        . . . f f f f f f . . . . 
        . f f f f f f f f f . . . 
        . f f f f f f c f f f . . 
        f f f f c f f f c f f f . 
        f c f f c c f f f c c f f 
        f c c f f f f e f f f f f 
        f f f f f f f e e f f f . 
        f f e e f b f e e f f f . 
        f f e 4 e 1 f 4 4 f f . . 
        . f f f e 4 4 4 4 f . . . 
        . 4 4 4 e e e e f f . . . 
        . e 4 4 e 7 7 7 7 f . . . 
        . f e e f 6 6 6 6 f f . . 
        . f f f f f f f f f f . . 
        . . f f . . . f f f . . . 
        `],
    100,
    characterAnimations.rule(Predicate.MovingRight)
    )
    characterAnimations.loopFrames(
    playerSprite,
    [img`
        . . . . f f f f . . . . . 
        . . f f c c c c f f . . . 
        . f f c c c c c c f f . . 
        f f c c c c c c c c f f . 
        f f c c f c c c c c c f . 
        f f f f f c c c f c c f . 
        f f f f c c c f c c f f . 
        f f f f f f f f f f f f . 
        f f f f f f f f f f f f . 
        . f f f f f f f f f f . . 
        . f f f f f f f f f f . . 
        f e f f f f f f f f e f . 
        e 4 f 7 7 7 7 7 7 c 4 e . 
        e e f 6 6 6 6 6 6 f e e . 
        . . . f f f f f f . . . . 
        . . . f f . . f f . . . . 
        `,img`
        . . . . . . . . . . . . . 
        . . . . . f f f f . . . . 
        . . . f f c c c c f f . . 
        . f f f c c c c c c f f . 
        f f c c c c c c c c c f f 
        f c c c c f c c c c c c f 
        . f f f f c c c c f c c f 
        . f f f f c c f c c c f f 
        . f f f f f f f f f f f f 
        . f f f f f f f f f f f f 
        . . f f f f f f f f f f . 
        . . e f f f f f f f f f . 
        . . e f f f f f f f f e f 
        . . 4 c 7 7 7 7 7 e 4 4 e 
        . . e f f f f f f f e e . 
        . . . f f f . . . . . . . 
        `,img`
        . . . . . . . . . . . . . 
        . . . . . f f f f . . . . 
        . . . f f c c c c f f . . 
        . . f f c c c c c c f f . 
        . f f f c c c c c c c f f 
        f f f c c c c c c c c c f 
        f f c c c f c c c c c c f 
        . f f f f f c c c f c f f 
        . f f f f c c f f c f f f 
        . . f f f f f f f f f f f 
        . . f f f f f f f f f f . 
        . . f f f f f f f f f e . 
        . f e f f f f f f f f e . 
        . e 4 4 e 7 7 7 7 7 c 4 . 
        . . e e f f f f f f f e . 
        . . . . . . . . f f f . . 
        `],
    100,
    characterAnimations.rule(Predicate.MovingUp)
    )
    characterAnimations.loopFrames(
    playerSprite,
    [img`
        . . . . f f f f . . . . . 
        . . f f c c c c f f . . . 
        . f f c c c c c c f f . . 
        f f c c c c c c c c f f . 
        f f c c f c c c c c c f . 
        f f f f f c c c f c c f . 
        f f f f c c c f c c f f . 
        f f f f f f f f f f f f . 
        f f f f f f f f f f f f . 
        . f f f f f f f f f f . . 
        . f f f f f f f f f f . . 
        f e f f f f f f f f e f . 
        e 4 f 7 7 7 7 7 7 c 4 e . 
        e e f 6 6 6 6 6 6 f e e . 
        . . . f f f f f f . . . . 
        . . . f f . . f f . . . . 
        `,img`
        . . . . . . . . . . . . . 
        . . . . . f f f f . . . . 
        . . . f f c c c c f f . . 
        . f f f c c c c c c f f . 
        f f c c c c c c c c c f f 
        f c c c c f c c c c c c f 
        . f f f f c c c c f c c f 
        . f f f f c c f c c c f f 
        . f f f f f f f f f f f f 
        . f f f f f f f f f f f f 
        . . f f f f f f f f f f . 
        . . e f f f f f f f f f . 
        . . e f f f f f f f f e f 
        . . 4 c 7 7 7 7 7 e 4 4 e 
        . . e f f f f f f f e e . 
        . . . f f f . . . . . . . 
        `,img`
        . . . . . . . . . . . . . 
        . . . . . f f f f . . . . 
        . . . f f c c c c f f . . 
        . . f f c c c c c c f f . 
        . f f f c c c c c c c f f 
        f f f c c c c c c c c c f 
        f f c c c f c c c c c c f 
        . f f f f f c c c f c f f 
        . f f f f c c f f c f f f 
        . . f f f f f f f f f f f 
        . . f f f f f f f f f f . 
        . . f f f f f f f f f e . 
        . f e f f f f f f f f e . 
        . e 4 4 e 7 7 7 7 7 c 4 . 
        . . e e f f f f f f f e . 
        . . . . . . . . f f f . . 
        `],
    100,
    characterAnimations.rule(Predicate.MovingDown)
    )
}
// Pick up the item at the player's location (if there is one).
function inv_PickUp () {
    inv_PickUpSprite(Grid_SpriteAtLocation(playerSprite.x / GRIDCELLSIZE, playerSprite.y / GRIDCELLSIZE))
}
function setSolid () {
    for (let item of [
    tiles.getTilesByType(sprites.builtin.brick),
    tiles.getTilesByType(assets.tile`myTile2`),
    tiles.getTilesByType(sprites.builtin.forestTiles22),
    tiles.getTilesByType(assets.tile`wall2LR`),
    tiles.getTilesByType(assets.tile`wall2LR0`),
    tiles.getTilesByType(assets.tile`yellowbrick`),
    tiles.getTilesByType(assets.tile`redbrick0`),
    tiles.getTilesByType(assets.tile`redbrick1`),
    tiles.getTilesByType(sprites.builtin.forestTiles25),
    tiles.getTilesByType(sprites.builtin.forestTiles21),
    tiles.getTilesByType(sprites.builtin.forestTiles23),
    tiles.getTilesByType(sprites.builtin.forestTiles0),
    tiles.getTilesByType(sprites.dungeon.darkGroundNorthWest0),
    tiles.getTilesByType(sprites.dungeon.darkGroundNorthWest1),
    tiles.getTilesByType(assets.tile`wall2R`),
    tiles.getTilesByType(assets.tile`wall2L`),
    tiles.getTilesByType(sprites.dungeon.floorDark0),
    tiles.getTilesByType(sprites.dungeon.floorLight2)
    ]) {
        for (let value of item) {
            tiles.setWallAt(value, true)
        }
    }
}
// Returns true if the used object is of the given type.
function inv_DestroySelected () {
    inv_UseObject.destroy()
    item = inv_ItemAtIndex(inv_Selected)
    sprites.setDataSprite(item, "sprite", Sprite_null())
    item.setImage(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    inv_UseObjectHandled()
    inv_EnsureSelection()
}
// Add a sprite to the inventory, if there is a free slot.
function inv_PickUpSprite (sprite: Sprite) {
    // do nothing if 'sprite' is null or not an inventory item.
    if (sprite != Sprite_null() && sprite.kind() == SpriteKind.InventoryItem) {
        index = inv_GetEmptySlotIndex()
        // If there is an empty inventory slot.
        if (index >= 0) {
            invItem = inv_ItemAtIndex(index)
            sprites.setDataSprite(invItem, "sprite", sprite)
            invItem.setImage(sprite.image)
            music.playTone(988, music.beat(BeatFraction.Half))
            Sprite_Hide(sprite)
            playerSprite.sayText(sprites.readDataString(sprite, "displayName"), 1000, false)
            inv_EnsureSelection()
        } else {
            music.playTone(131, music.beat(BeatFraction.Half))
            inv_Box.sayText("Full", 1000, false)
        }
    } else {
        music.playTone(147, music.beat(BeatFraction.Half))
        console.log("nothing to pick up")
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy_Chaser, function (sprite, otherSprite) {
    playerHealth += -2
    music.zapped.play()
})
// Main
let switchState = false
let healthStatusBar: StatusBarSprite = null
let statusbar: StatusBarSprite = null
let SPEED = 0
let item: Sprite = null
let Switch_Active: Sprite = null
let playerOnGround = false
let inventory: Sprite[] = []
let inv_Box: Sprite = null
let inv_SelectionBox: Sprite = null
let value = 0
let playerInWater = false
let playerUnderWater = false
let playerHealth = 0
let list: Sprite[] = []
let y = 0
let x = 0
let inv_MAX = 0
let inv_Selected = 0
let invItem: Sprite = null
let index = 0
let GRIDCELLSIZE = 0
let playerSprite: Sprite = null
let playerVerticalMove = false
let mySprite: Sprite = null
let inv_UseObject: Sprite = null
let level = 0
level = 0
StartLevel()
// Handlers for levers.
game.onUpdate(function () {
    if (Switch_Active != Sprite_null()) {
        switchState = sprites.readDataBoolean(Switch_Active, "switchState")
        if (sprites.readDataString(item, "switchID") == "A") {
            if (switchState) {
                inv_Box.sayText("Switch A On", 1000, false)
                Switch_Handled()
            }
        } else {
        	
        }
    }
})
game.onUpdate(function () {
    healthStatusBar.value = playerHealth
    if (playerHealth <= 0) {
        game.over(false, effects.dissolve)
    }
})
game.onUpdate(function () {
    if (controller.left.isPressed()) {
        Player_DetermineOnLadder()
        characterAnimations.setCharacterState(playerSprite, characterAnimations.rule(Predicate.MovingLeft))
        playerSprite.vx = 0 - SPEED
        if (playerOnGround) {
            music.footstep.play()
        }
    } else if (controller.right.isPressed()) {
        Player_DetermineOnLadder()
        characterAnimations.setCharacterState(playerSprite, characterAnimations.rule(Predicate.MovingRight))
        playerSprite.vx = SPEED
        if (playerOnGround) {
            music.footstep.play()
        }
    } else {
        characterAnimations.clearCharacterState(playerSprite)
        playerSprite.vx = playerSprite.vx / 2
    }
    if (playerSprite.tileKindAt(TileDirection.Bottom, sprites.dungeon.hazardWater)) {
        music.smallCrash.play()
    }
    if (playerSprite.isHittingTile(CollisionDirection.Bottom) && !(playerVerticalMove)) {
        if (!(playerOnGround)) {
            music.thump.play()
            scene.cameraShake(4, 100)
            playerOnGround = true
        }
    } else {
        playerOnGround = false
    }
    if (playerVerticalMove) {
        Player_DetermineOnLadder()
        if (controller.up.isPressed()) {
            characterAnimations.setCharacterState(playerSprite, characterAnimations.rule(Predicate.MovingUp))
            playerSprite.vy = 0 - SPEED
        } else if (controller.down.isPressed()) {
            characterAnimations.setCharacterState(playerSprite, characterAnimations.rule(Predicate.MovingDown))
            playerSprite.vy = SPEED
        } else {
            playerSprite.vy = 0
        }
        playerSprite.ay = 0
    } else {
        playerSprite.ay = 100
    }
})
game.onUpdate(function () {
    for (let value of sprites.allOfKind(SpriteKind.Enemy_Chaser)) {
        if (value.x < playerSprite.x || Math.percentChance(10)) {
            value.vx = 25
            characterAnimations.setCharacterState(value, characterAnimations.rule(Predicate.MovingRight))
        } else {
            value.vx = -25
            characterAnimations.setCharacterState(value, characterAnimations.rule(Predicate.MovingLeft))
        }
        if (value.y < playerSprite.y || Math.percentChance(20)) {
            value.vy = 25
        } else {
            value.vy = -25
        }
    }
})
game.onUpdate(function () {
    if (inv_UsedObjectIs("health")) {
        music.powerUp.play()
        playerHealth = Math.constrain(playerHealth + sprites.readDataNumber(inv_UseObject, "health"), 0, 100)
        inv_DestroySelected()
    }
})
game.onUpdate(function () {
    for (let value of sprites.allOfKind(SpriteKind.Enemy_Horiz)) {
        if (value.isHittingTile(CollisionDirection.Left)) {
            value.vx = 50
        } else if (value.isHittingTile(CollisionDirection.Right)) {
            value.vx = -50
        } else if (value.vx == 0) {
            value.vx = 50
        }
        value.vy = 0
    }
})
game.onUpdate(function () {
    if (inv_UsedObjectIs("key")) {
        mySprite = Grid_SpriteAtLocation(playerSprite.x / GRIDCELLSIZE + 1, playerSprite.y / GRIDCELLSIZE)
        if (mySprite == Sprite_null() || mySprite.kind() != SpriteKind.Door) {
            mySprite = Grid_SpriteAtLocation(playerSprite.x / GRIDCELLSIZE - 1, playerSprite.y / GRIDCELLSIZE)
        }
        // If player is at a door.
        if (mySprite != Sprite_null() && mySprite.kind() == SpriteKind.Door) {
            if (sprites.readDataString(mySprite, "keyID") == sprites.readDataString(inv_SpriteAtIndex(inv_Selected), "keyID")) {
                tiles.setWallAt(grid.getLocation(mySprite), false)
                mySprite.setImage(assets.image`door_open`)
            } else {
                music.playTone(147, music.beat(BeatFraction.Half))
            }
        }
        inv_UseObjectHandled()
    }
})
// Actions every frame for inventory system.
game.onUpdate(function () {
    // Position the selected item box.
    inv_SelectionBox.x = inv_ItemAtIndex(inv_Selected).x
})
