+++
title = 'bad-directions'
weight = 40
+++

[Demo](https://tan.ge/bad-directions) | [Repo](https://github.com/s1gtrap/bad-directions)

An extremely silly web app that can give you a step-by-step route from a point of origin to your destination in text form, but also gives you the option to translate to one of ~20 different languages an unlimited number of times to help obscure your route or even challenge your sense of direction!

Inspired by a bit from a comedy show: got home and had a working prototype the day after. It relies entirely on [OSRM](http://project-osrm.org/) for pathfinding, [OpenStreetMap](https://www.openstreetmap.org/) (specifically [Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim)) for geocoding, and [LibreTranslate](https://libretranslate.com/) for translation (~~specifically [this mirror](https://libretranslate.eownerdead.dedyn.io/) for graciously allowing CORS requests for free 🖤~~, as of 1st of April 2024: no free and open mirrors remain so my home server will need to suffice, though it's extremely slow).
