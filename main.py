def on_up_pressed():
    player1.vy = -150
controller.up.on_event(ControllerButtonEvent.PRESSED, on_up_pressed)

def on_left_pressed():
    pass
controller.left.on_event(ControllerButtonEvent.PRESSED, on_left_pressed)

def on_right_pressed():
    pass
controller.right.on_event(ControllerButtonEvent.PRESSED, on_right_pressed)

player1: Sprite = None
SPEED = 50
scene.set_background_color(8)
tiles.set_tilemap(tilemap("""
    level1
"""))
player1 = sprites.create(assets.image("""
    PlayerSprite
"""), SpriteKind.player)
player1.ay = 100
scene.camera_follow_sprite(player1)
player1.set_position(50, 50)
player1.fx = 20

def on_on_update():
    if controller.left.is_pressed():
        player1.vx = 0 - SPEED
    elif controller.right.is_pressed():
        player1.vx = SPEED
game.on_update(on_on_update)
