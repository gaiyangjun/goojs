define([
	'goo/scripts/Scripts',
	'goo/math/Vector3',
	'goo/math/MathUtils',
], function(
	Scripts,
	Vector3,
	MathUtils
) {
	'use strict';

	var externals = {
		name: 'MouseLookScript',
		description: 'Click and drag to change rotation of entity, usually a camera',
		parameters: [
			{
				key: 'button',
				name: 'Mouse button',
				type: 'string',
				control: 'select',
				'default': 'Left',
				options: ['Any', 'Left', 'Middle', 'Right']
			},
			{
				key: 'speed',
				name: 'Speed',
				type: 'float',
				control: 'slider',
				'default': 1.0,
				min: -10,
				max: 10,
				scale: 0.1
			},
			{
				key: 'maxAscent',
				name: 'Max Ascent',
				type: 'float',
				control: 'slider',
				'default': 89.95,
				min: -89.95,
				max: 89.95
			},
			{
				key: 'minAscent',
				name: 'Min Ascent',
				type: 'float',
				control: 'slider',
				'default': -89.95,
				min: -89.95,
				max: 89.95
			}
		]
	};

	function MouseLookScript() {
		var buttonPressed = false;
		var lastX, lastY, x, y;
		var angles;

		function mouseDown(e) {
			buttonPressed = true;
			lastX = x = e.clientX;
			lastY = y = e.clientY;
		}
		function mouseMove(e) {
			if (buttonPressed) {
				x = e.clientX;
				y = e.clientY;
			}
		}
		function mouseUp(e) {
			buttonPressed = false;
		}

		function setup(parameters, environment) {
			var domElement = environment.domElement;
			domElement.addEventListener('mousedown', mouseDown);
			domElement.addEventListener('mousemove', mouseMove);
			domElement.addEventListener('mouseup', mouseUp);
			domElement.addEventListener('mouseleave', mouseUp);

			angles = new Vector3();
		}
		function update(parameters, environment) {
			if (x == lastX && y == lastY) {
				return;
			}
			var deltaX = x - lastX;
			var deltaY = y - lastY;
			var entity = environment.getEntity();
			var rotation = entity.transformComponent.transform.rotation;
			rotation.toAngles(angles);
			
			var pitch = angles.data[0];
			var yaw = angles.data[1];
			
			var maxAscent = parameters.maxAscent * MathUtils.DEG_TO_RAD;
			var minAscent = parameters.minAscent * MathUtils.DEG_TO_RAD;
			pitch = MathUtils.clamp(pitch + deltaY * parameters.speed / 200, minAscent, maxAscent);
			yaw += deltaX * parameters.speed / 200;
			rotation.fromAngles(pitch, yaw, 0);
			entity.transformComponent.setUpdated();
			lastX = x;
			lastY = y;
			
			
		}
		function cleanup(parameters, environment) {
			var domElement = environment.domElement;
			domElement.removeEventListener('mousedown', mouseDown);
			domElement.removeEventListener('mousemove', mouseMove);
			domElement.removeEventListener('mouseup', mouseUp);
			domElement.removeEventListener('mouseleave', mouseUp);
		}

		return {
			setup: setup,
			update: update,
			cleanup: cleanup,
			externals: externals
		};
	}

	Scripts.register(externals, MouseLookScript);

	return MouseLookScript;
});