var g_font = "";
var g_text = get_text();
var g_hot = false;
var ww = 0, wh = 0;
var colours = {
	text : 0,
	background : 0,
	highlight : 0,
}

var DWRITE_TEXT_ALIGNMENT_CENTER = 2;
var DWRITE_PARAGRAPH_ALIGNMENT_CENTER = 2;

var ColourTypeCUI = {
	text: 0,
	selection_text: 1,
	inactive_selection_text: 2,
	background: 3,
	selection_background: 4,
	inactive_selection_background: 5,
	active_item_frame: 6
};

var ColourTypeDUI = {
	text: 0,
	background: 1,
	highlight: 2,
	selection: 3
};

var FontTypeCUI = {
	items : 0,
	labels : 1,
};

var FontTypeDUI = {
	defaults : 0,
	tabs : 1,
	lists : 2,
	playlists : 3,
	statusbar : 4,
	console : 5,
};

update_colours();
update_font();

function update_colours() {
	if (window.IsDefaultUI) {
		colours.text = window.GetColourDUI(ColourTypeDUI.text);
		colours.highlight = window.GetColourDUI(ColourTypeDUI.highlight);
		colours.background = window.GetColourDUI(ColourTypeDUI.background);
	} else {
		colours.text = window.GetColourCUI(ColourTypeCUI.text);
		colours.highlight = window.GetColourCUI(ColourTypeCUI.text);
		colours.background = window.GetColourCUI(ColourTypeCUI.background);
	}
}

function update_font() {
	if (window.IsDefaultUI) {
		g_font = window.GetFontDUI(FontTypeDUI.defaults);
	} else {
		g_font = window.GetFontCUI(FontTypeCUI.items);
	}

	// increase size
	var obj = JSON.parse(g_font);
	obj.Size += 10;
	g_font = JSON.stringify(obj);
}

function get_text() {
	var text = "JScript Panel " + utils.VersionString + " 🤪\n\n";
	text += "Click here to open the editor.";
	return text;
}

function on_colours_changed() {
	update_colours();
	window.Repaint();
}

function on_font_changed() {
	update_font();
	window.Repaint();
}

function on_mouse_lbtn_up(x, y) {
	window.ShowConfigure();
}

function on_mouse_leave() {
	if (g_hot) {
		g_hot = false;
		window.Repaint();
	}
}

function on_mouse_move() {
	if (!g_hot) {
		g_hot = true;
		window.Repaint();
	}
}

function on_paint(gr) {
	gr.Clear(colours.background);
	gr.WriteText(g_text, g_font, g_hot ? colours.highlight : colours.text, 0, 0, ww, wh, DWRITE_TEXT_ALIGNMENT_CENTER, DWRITE_PARAGRAPH_ALIGNMENT_CENTER);
}

function on_size() {
	ww = window.Width;
	wh = window.Height;
}
