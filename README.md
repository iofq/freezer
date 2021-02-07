# freezer.life, containerized

## so what is freezer?

[Freezer](https://freezer.life) is a 'Free music streaming client for Deezer based on the Deezloader/Deemix "bug"'. Essentially, you get read-write access to all Deezer content in a somewhat buggy but nevertheless charming Vue.js app, for free (as in beer!). Normally a desktop (electron) app, this container allows you to run a server on localhost and serve a Freezer instance to your LAN or the internet via proxy. You can also mount a local (on the server) download directory and queue FLAC quality downloads from any browser!

## caveats

[Freezer](https://freezer.life) currently only supports one concurrent user. It is a desktop application, after all. If you do plan on opening this to the internet, use `.htaccess` or something to prevent unwanted access. Or run multiple instances on different ports and use a separate authentication service to manage them.


It's also worth mentioning that, yes, using Freezer is probably illegal wherre you live. And it's most definitely against Deezer's TOS. Expect your Deezer account to get banned and your house to get SWATted if you decide to use this application.

## quick start
```bash
docker run -d \
    -p 10069:10069 \
    iofq/freezer -H 0.0.0.0
```

## configuration
### settings

This container accepts any cli flags found in [background.js](https://git.rip/freezer/freezerpc/-/blob/master/app/background.js). Alternatively, you can run:

```bash
docker run --rm -it iofq/freezer --help
```

You'll almost always want `-H 0.0.0.0` to listen on all interfaces. And, unintuitively, the `-S` / `--server` flag doesn't do anything in the context of this container.

For more in-depth configuration, a settings.json file can be edited and placed at `/root/.config/freezer/settings.json`. You can generate one by:

```bash
docker run --rm -it iofq/freezer --settings
```

And drop in place by adding this to your docker run command:

```bash
-v /absolute/path/settings.json:/root/.config/freezer/settings.json
```

### downloads
By default, Freezer places downloads in `/root/FreezerMusic`. To persist these on local storage, create a volume mount:

```bash
docker run ... \
    -v /local/storage:/root/FreezerMusic \
    iofq/freezer
```

### support
[Consider the money you're saving with Freezer and throw a couple bucks towards the developers!](https://git.rip/freezer/freezerpc#support-me)
