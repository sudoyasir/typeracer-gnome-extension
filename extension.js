const St = imports.gi.St;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const Mainloop = imports.mainloop;
const PanelMenu = imports.ui.panelMenu;
const Clutter = imports.gi.Clutter;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let panelButton, panelButtonText;
let averageTypingSpeed = "Loading..."; // Default text while fetching data

function init() {
    panelButton = new PanelMenu.Button(0.0);

    panelButtonText = new St.Label({
        text: "⌨ " + averageTypingSpeed,
    });

    // Center the text vertically and horizontally within the label
    panelButtonText.set_x_align(Clutter.ActorAlign.CENTER);
    panelButtonText.set_y_align(Clutter.ActorAlign.CENTER);

    panelButton.actor.add_child(panelButtonText);
}

function enable() {
    // Fetch and update the typing speed every 30 seconds (adjust as needed)
    fetchTypingSpeed();
    let updateInterval = Mainloop.timeout_add_seconds(10, fetchTypingSpeed);

    // Insert your extension at the desired position in the panel
    Main.panel.addToStatusArea('Type Racer', panelButton, 2, 'left');
}

function disable() {
    Main.panel.statusArea['Type Racer'].destroy(); // Remove your extension from the panel
}

function fetchTypingSpeed() {
    let pythonScriptPath = Me.dir.get_path() + '/speedFetcher.py';

    let subprocess = new Gio.Subprocess({
        argv: ['/usr/bin/python3', pythonScriptPath],
        flags: Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE,
    });

    subprocess.init(null);

    let outStream = new Gio.DataInputStream({
        base_stream: subprocess.get_stdout_pipe(),
    });

    let result = '';

    // Read the output line by line
    let [line, length] = outStream.read_line(null);
    while (line != null) {
        result += line + '\n';
        [line, length] = outStream.read_line(null);
    }

    subprocess.wait(null);

    if (result.length > 0) {
        // Parse the typing speed as a float and format it with two decimal places
        let typingSpeed = parseFloat(result.trim()).toFixed(2);
        averageTypingSpeed = typingSpeed.toString();
    } else {
        averageTypingSpeed = "N/A";
    }

    // Update the panel button text
    panelButtonText.text = "⌨  " + averageTypingSpeed + " ʷᵖᵐ";
}
