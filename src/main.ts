import fs from "fs";
import path from "path"
import JSON5 from "json5"

function rename() {
    const dir = path.join(process.env.APPDATA, "../", "Local", "Temp", "Minecraft Bedrock", "minecraftpe", "packcache", "resource")

    fs.readdir(dir, {}, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        for (const file of files) {
            fs.readFile(path.join(dir, file as string, "manifest.json"), (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                let name = "no name";
                try {
                    const packJson = JSON5.parse(data.toString())
                    name = packJson.header.name
                }
                catch (e) {
                    console.error(e);
                    fs.readFile(path.join(dir, file as string, "texts", "en_US.lang"), (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        name = data.toString().split("pack.name=")[1].split("\n")[0];
                    })
                }
                let after = -1
                let newName = ""
                for (let i = 0; i < name.length; i++) {
                    if (name.charAt(i) == "§") {
                        after = i + 1;
                        continue;
                    } else if (i == after) {
                        after = -1;
                        continue;
                    }
                    newName += name.charAt(i)
                }
                name = newName
                fs.rename(path.join(dir, file as string), path.join(dir, name), (err) => {
                    if (err) {
                        console.error(err)
                        return;
                    }
                    console.log(`✅ Renamed | ${file} ➡️ ${name}`);
                })
            })
        }
        setTimeout(() => {
            console.log(`🏁 Complete!`)
        }, 2000)
    })

}

rename();