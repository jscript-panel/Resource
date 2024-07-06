// ==PREPROCESSOR==
// @name "MainMenuManager"
// @author "marc2003"
// ==/PREPROCESSOR==

var MF_STRING = 0x00000000;
var img = utils.LoadImage(fb.ComponentPath + 'samples\\images\\foobar2000.png');

function on_focus(is_focused) {
	if (is_focused) {
		// Ensure Edit menu commands are made available
		plman.SetActivePlaylistContext();
	}
}

function on_mouse_lbtn_up(x, y) {
	if (containsXY(x, y)) {
		menu();
	}
}

function on_mouse_rbtn_up(x, y) {
	if (containsXY(x, y)) {
		return help();
	}
	return false;
}

function on_paint(gr) {
	gr.DrawImage(img, 0, 0, window.Height, window.Height, 0, 0, img.Width, img.Height);
}

function containsXY(x, y) {
	return x > 0 && x < window.Height && y > 0 && y < window.Height;
}

function help(x, y) {
	var menu = window.CreatePopupMenu();
	ha_links.forEach(function (item, i) {
		menu.AppendMenuItem(MF_STRING, i + 100, item[0]);
		if (i == 1) {
			menu.AppendMenuSeparator();
		}
	});
	menu.AppendMenuSeparator();
	menu.AppendMenuItem(MF_STRING, 1, 'Configure...');

	var idx = menu.TrackPopupMenu(x, y);
	menu.Dispose();

	switch (true) {
	case idx == 0:
		break;
	case idx == 1:
		window.ShowConfigure();
		break;
	default:
		utils.Run(ha_links[idx - 100][1]);
		break;
	}
	return true;
}

function main_menu_helper(name, base_id, main_menu) {
	this.popup = window.CreatePopupMenu();
	this.mm = fb.CreateMainMenuManager(name);
	this.mm.BuildMenu(this.popup, base_id);
	this.popup.AppendTo(main_menu, MF_STRING, name);
}

function menu(x, y, flags) {
	var menu = window.CreatePopupMenu();
	var popup_context = window.CreatePopupMenu();
	var context = fb.CreateContextMenuManager();

	var file = new main_menu_helper('File', 10000, menu);
	var edit = new main_menu_helper('Edit', 20000, menu);
	var view = new main_menu_helper('View', 30000, menu);
	var playback = new main_menu_helper('Playback', 40000, menu);
	var library = new main_menu_helper('Library', 50000, menu);
	var help = new main_menu_helper('Help', 60000, menu);

	if (fb.IsPlaying) {
		menu.AppendMenuSeparator();
		context.InitNowPlaying();
		context.BuildMenu(popup_context, 70000);
		popup_context.AppendTo(menu, MF_STRING, 'Now Playing');
	}

	var idx = menu.TrackPopupMenu(x, y, flags);
	menu.Dispose();

	switch (true) {
	case idx == 0:
		break;
	case idx < 20000:
		file.mm.ExecuteByID(idx - 10000);
		break;
	case idx < 30000:
		edit.mm.ExecuteByID(idx - 20000);
		break;
	case idx < 40000:
		view.mm.ExecuteByID(idx - 30000);
		break;
	case idx < 50000:
		playback.mm.ExecuteByID(idx - 40000);
		break;
	case idx < 60000:
		library.mm.ExecuteByID(idx - 50000);
		break;
	case idx < 70000:
		help.mm.ExecuteByID(idx - 60000);
		break;
	case idx < 80000:
		context.ExecuteByID(idx - 70000);
		break;
	}

	file.mm.Dispose();
	edit.mm.Dispose();
	view.mm.Dispose();
	playback.mm.Dispose();
	library.mm.Dispose();
	help.mm.Dispose();
	context.Dispose();
}

var ha_links = [
	['Title Formatting Reference', 'https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference'],
	['Query Syntax', 'https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Query_syntax'],
	['Homepage', 'https://www.foobar2000.org/'],
	['Components', 'https://www.foobar2000.org/components'],
	['Wiki', 'https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Foobar2000'],
	['Forums', 'https://hydrogenaud.io/index.php/board,28.0.html']
];
