// ==UserScript==
// @name         OSM Dark Mode+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Dark mode for OpenStreetMap website
// @author       Ancymon
// @match        https://www.openstreetmap.org/*
// @icon         https://www.google.com/s2/favicons?domain=openstreetmap.org
// @grant      GM_getResourceText
// @grant      GM_addStyle
// @resource   IMPORTED_CSS https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@1.0.0/dist/css/bootstrap-dark.min.css
// @run-at document-end
// ==/UserScript==

(
    function () {
        'use strict';

        const bootstrapDark = GM_getResourceText("IMPORTED_CSS");
        GM_addStyle(bootstrapDark);

        const darkColor = '#343a40';
        const darkColorSecondary = '#3a4046';
        const primaryFontColor = '#FFFFFF';
        const activeElemColor = '#4c545d';
        const linkColor = '#e1e1e1';
        const osmGreenColor = '#76c551'; //'#76c551';
        let css = `
        .details, .secondary-actions { font-size: small !important; }
        .browse-section p, .note-description { border-left: 5px solid ${osmGreenColor} !important; padding-left: 15px !important; padding-top: 10px !important; padding-bottom: 10px !important; padding-right: 10px !important; background-color: ${darkColorSecondary} !important; border-radius: 0.25rem !important; font-size: normal !important; }
        .btn-outline-primary { border-color: ${osmGreenColor} !important; }
        .changesets .row { font-size: small !important; }
        .loader { filter: invert(80%) !important; }
        .text-dark, .geolink { color: ${primaryFontColor} !important; }
        li.selected { background-color: ${activeElemColor} !important; }
        .browse-tag-k, .browse-tag-v { background-color: ${darkColorSecondary} !important; border-bottom: 1px solid ${darkColor} !important; border-left: 0 !important;  height: 40px !important;}
        .browse-tag-list { color: #e9ecef !important; font-size: small !important; border: 1px solid ${darkColor} !important; background-color: ${darkColorSecondary} !important; }
        .search_form, .directions_form, .layers-ui .base-layers li label, .ideditor input[type="search"], .field-label, .body.small-nav header, body.small-nav header { background-color: ${darkColor} !important; color: ${primaryFontColor} !important;}
        #sidebar_content .note-comments li p { border-left: 5px solid ${osmGreenColor} !important; padding: 10px !important; background-color: ${darkColorSecondary} !important; border-radius: 0.25rem !important; font-size: small !important; }
        #sidebar_content .list-unstyled { font-size: small !important; }
        #sidebar_content h4 { font-size: medium !important; }
        #sidebar_content h2 { font-size: large !important; }
        #sidebar_content bdi { padding: 2px; font-weight: 600;}
        #sidebar_content a { color: ${linkColor} !important; text-decoration: underline dotted !important; }
        .list-unstyled { background-color: ${darkColorSecondary} !important; }
        .list-unstyled li { padding: 5px !important; }
        .ideditor .sidebar, .ideditor .fillL, .bg-light { background-color: ${darkColor} !important; color: ${primaryFontColor} !important; }
        .ideditor button, #map-ui { background: ${darkColorSecondary} !important; color: ${primaryFontColor} !important;}
        .ideditor .preset-list-button-wrap { background: ${darkColorSecondary} !important; color: ${primaryFontColor} !important; border: 1px solid ${darkColor} !important; }
        .ideditor .preset-list-button .label { background: ${darkColorSecondary} !important; color: ${primaryFontColor} !important; border: 1px solid ${darkColor} !important; }
        .ideditor .section .grouped-items-area { background-color: ${darkColorSecondary} !important; }
        .map-layout #sidebar { background-color: ${darkColor} !important; }
        .content-heading { background-color: ${darkColorSecondary} !important; color: ${primaryFontColor} !important;}
        `;

        GM_addStyle(css);

        const checkElement = async selector => {
            while (document.querySelector(selector) === null) {
                await new Promise(resolve => requestAnimationFrame(resolve))
            }
            return document.querySelector(selector);
        };

        checkElement('body').then((selector) => {
            selector.classList.add("bg-dark");
        });

        var pageURLCheckTimer = setInterval(
            function () {
                if (this.lastPathStr !== location.pathname ||
                    this.lastQueryStr !== location.search ||
                    this.lastPathStr === null ||
                    this.lastQueryStr === null
                ) {
                    this.lastPathStr = location.pathname;
                    this.lastQueryStr = location.search;
                    gmMain();
                }
            }, 222);

        function createButton(buttonLink, buttonTitle, buttonBg) {
            let link = document.createElement("a");
            let infoBadge = document.createElement("span");
            infoBadge.classList.add("badge", `bg-${buttonBg}`, "text-dark", "m-1", "p-1");
            link.innerText = buttonTitle;
            link.href = buttonLink;
            link.target = "_blank";
            infoBadge.appendChild(link);
            return infoBadge;
        }

        function gmMain() {
            if (window.location.pathname.startsWith('/changeset/')) {
                checkElement('.map-layout #sidebar h2').then((selector) => {
                    let text = selector.innerText;

                    if (text.startsWith('Zestaw zmian')) {
                        //
                        let changesetId = text.replace('Zestaw zmian: ', '');
                        let browseSection = document.querySelectorAll('.browse-section');
                        let osmchaButton = createButton(`https://osmcha.org/changesets/${changesetId}/`, 'OSMCha', 'info');
                        let achaviButton = createButton(`https://overpass-api.de/achavi/?changeset=${changesetId}`, 'Achavi', 'warning')
                        browseSection[0].prepend(achaviButton);
                        browseSection[0].prepend(osmchaButton);
                    }
                });
            } else if (window.location.pathname.startsWith('/relation/')) {
                checkElement('.browse-relation').then((selector) => {
                    let relationId = window.location.pathname.replace('/relation/', '').replace('/history/', '');
                    let raButton = createButton(`http://ra.osmsurround.org/analyzeRelation?relationId=${relationId}&_noCache=on`, 'RelationAnalyzer', 'info');
                    let osmHistoryButton = createButton(`https://pewu.github.io/osm-history/#/relation/${relationId}`, 'OSM-History', 'warning');
                    let osmDeepHistoryButton = createButton(`https://osmlab.github.io/osm-deep-history/#/relation/${relationId}`, 'Deep History', 'primary');
                    selector.prepend(osmDeepHistoryButton);
                    selector.prepend(osmHistoryButton);
                    selector.prepend(raButton);

                });
            } else if (window.location.pathname.startsWith('/node/')) {
                checkElement('.browse-node').then((selector) => {
                    let fullNode = document.querySelectorAll("div.flex-grow-1.text-break h2 bdi");
                    let nodeId = window.location.pathname.replace('/node/', '').replace('/history/', '');
                    let osmHistoryButton = createButton(`https://pewu.github.io/osm-history/#/node/${nodeId}`, 'OSM-History', 'info');
                    let osmDeepHistoryButton = createButton(`https://osmlab.github.io/osm-deep-history/#/node/${nodeId}`, 'Deep History', 'primary');
                    selector.prepend(osmDeepHistoryButton);
                    selector.prepend(osmHistoryButton);
                });
            } else if (window.location.pathname.startsWith('/way/')) {
                checkElement('.browse-way').then((selector) => {
                    let fullNode = document.querySelectorAll("div.flex-grow-1.text-break h2 bdi");
                    let wayId = window.location.pathname.replace('/way/', '').replace('/history/', '');
                    let osmDeepHistoryButton = createButton(`https://osmlab.github.io/osm-deep-history/#/way/${wayId}`, 'Deep History', 'primary');
                    let osmHistoryButton = createButton(`https://pewu.github.io/osm-history/#/way/${wayId}`, 'OSM-History', 'info');
                    selector.prepend(osmDeepHistoryButton);
                    selector.prepend(osmHistoryButton);
                });
            }
        }

        // MENU - new elements
        checkElement('nav.primary').then((selector) => {
            let userName = document.querySelector(".username").innerText.trim();
            let changesNode = document.createElement("div");
            let changesLink = document.createElement("a");
            let contributionNode = document.createElement("div");
            let contributionLink = document.createElement("a");

            changesNode.classList.add("btn-group");
            changesLink.classList.add("btn", "btn-outline-info", "geolink", "text-light");
            changesLink.innerText = 'Moje zmiany';
            changesLink.href = `/user/${userName}/history`;
            contributionLink.classList.add("btn", "btn-outline-info", "text-light");
            contributionLink.innerText = 'Mój wkład';
            contributionLink.href = `http://hdyc.neis-one.org/?${userName}`;
            contributionLink.target = "_blank"
            changesNode.appendChild(changesLink);
            changesNode.appendChild(contributionLink);
            selector.appendChild(changesNode);

        });

    })();