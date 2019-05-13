/**
 * Explore plugin.
 */
Draw.loadPlugin(function(editorUi)
{
	var div = document.createElement('div');
	var keep = '\n\t`~!@#$%^&*()_+{}|:"<>?-=[]\;\'.\/,\n\t';
	
	// Adds resource for action
	mxResources.parse('switchFR=Switch FR');
	mxResources.parse('switchEN=Switch EN');

	function switchLanguage(language)
	{
		var graph = editorUi.editor.graph;
		var model = graph.model;
		
		model.beginUpdate();
		try
		{
			// Queue used to fix ancestor placeholders
			var queue = [];

			for (var id in model.cells)
			{
				var cell = model.cells[id];
				var value = cell.value;
				
				if (mxUtils.isNode(cell.value) && value.getAttribute('placeholders') == '1' )
				{
					var hasAttribute = false;
					for (var i = 0; i < cell.value.attributes.length; i++)
					{	
						if(value.attributes[i].name == language)
							hasAttribute = true;
					}
					
					if(hasAttribute)
						value.setAttribute('label','%'+language+'%');

				}
				
				queue.push({cell: cell, value: value});
			}
			
			for (var i = 0; i < queue.length; i++)
			{
				model.setValue(queue[i].cell, queue[i].value);
			}
		}
		finally
		{
			model.endUpdate();
		}
	}
	
	// Adds action
	editorUi.actions.addAction('switchFR', function()
	{
		switchLanguage('FR');
	});
	
	editorUi.actions.addAction('switchEN', function()
	{
		switchLanguage('EN');
	});
	
	var menu = editorUi.menus.get('extras');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent)
	{
		oldFunct.apply(this, arguments);
		
		editorUi.menus.addMenuItems(menu, ['-', 'switchFR'], parent);
		editorUi.menus.addMenuItems(menu, ['-', 'switchEN'], parent);
	};

});
