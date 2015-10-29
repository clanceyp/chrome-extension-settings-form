/**
 * @author patcla
 */

(function($, chrome, ko, window){
"use strict";

var backgroundPage = chrome.extension.getBackgroundPage(),
    HELP = window.HELP,
    DEBUG = window.DEBUG,
    DEFAULT_VALUES = window.DEFAULT_VALUES,
    options = {
        ops:FORMS["settings"],
        init:function(context){
            var manifest = chrome.runtime.getManifest();
            $(".header__heading").html('<span class="appName"></span> <span class="appVersion header__heading-version"></span>');
            $(".appVersion").text(manifest.version);
            $(".appName").text(manifest.name);
            options.setupForm();
            options.columnInfoViewModelInit();
            options.setupHelp();
            if (context && !context.options){
                context.options = options;
            }
        },
        setupHelp:function(){
            for (var item in HELP){
                if ( $('.'+ item + '__container').length === 1 && HELP[item]){
                    $('.'+ item + '__container').append('<span class="more"><span class="help"></span></span>');
                    $('.'+ item + '__container .help').html( HELP[item] );
                } else if (DEBUG){
                    window.console.log( item + " not found");
                }
            }
        },
        getItemValue:function(key){
            return backgroundPage.options.getLocalStore(key);
        },
        get:function(key){
            return options.getItemValue(key);
        },
        saveItemValue:function(target){
            console.log("saveItemValue", target)
            if (!target){return true;}
            var id = $(target).attr("id"),
                name =  $(target).attr("name"),
                value = $(target).val(),
                type = $(target).attr('type');
                console.log(id, name, value, type);
            if (type === "checkbox"){
                backgroundPage.options.setLocalStore(name, $(target).prop('checked') );
            } else {
                backgroundPage.options.setLocalStore(name, value);
            }
        },
        handleValueChange:function(e){
            var target = e.target;
            options.saveItemValue(target);
        },
        handleRangeSlider:function(e){
            $(e.target).trigger('change');
        },
        handleKeyup:function(e){
            var target = e.target;
            options.saveItemValue(target);
        },
        handleClick:function(e){
            var target = e.target;
            if (!target){return true;}
            if ($(target).attr('type') === 'reset'){
                e.preventDefault();
                options.resetForm();
            } else if ($(target).attr('type') === 'checkbox'){
                options.saveItemValue(target);
            } else if ($(target).attr('type') === 'radio'){
                options.saveItemValue(target);
            }
        },
        handleDblClick:function(e){
            var target = e.target,
                id = $(target).attr('id');
            if (!target){return true;}
            if (DEFAULT_VALUES[id] && window.confirm('Reset '+ id +' element to it\'s default value')){
                $(target).val( DEFAULT_VALUES[id] );
                options.saveItemValue(target);
            }
        },
        handleRangeChange:function(e){
            var $target = $(e.target),
                value = $target.val();
            $target
                .closest(".settings__form-row")
                .find(".settings__form-label")
                .data("value", value)
                .data("suffix", $target.data("suffix"))
        },
        resetForm:function(){
            backgroundPage.options.resetLocalStore();
            $('form fieldset').empty();
            options.setupForm();
        },
        setupForm:function(){
            function createDefaultRow(element){
                var value = options.getItemValue(element.name) || element.value,
                    type = element.html5 || element.type,
                    $row = $("<p />").appendTo(element.parent);
                $row
                    .addClass(element.name +'__container settings__form-row settings__form-row--'+ type)
                    .append('<label for="'+ element.id +'" class="settings__form-label settings__form-label--'+type+'">'+ element.label +'</label>');
                if (element.type === "textarea"){
                    $row.append('<textarea name="'+ element.name +'" id="'+ element.id +'" class="settings__form-item settings__form-item--'+type+'"></textarea>');
                } else {
                    $row.append('<input name="'+ element.name +'" type="'+ type +'" id="'+ element.id +'" class="settings__form-item settings__form-item--'+type+'" />');
                }
                $.each(element.ops, function(op, i){
                    console.log(op, element.ops[op]);
                    $('#'+ element.id ).attr(op, element.ops[op]);
                });$.each(element.data, function(op, i){
                    console.log(op, element.ops[op]);
                    $('#'+ element.id ).data(op, element.data[op]);
                });
                console.log(element.id, element.name, value, element.type, element.html5 );
                if (value){
                    $('#'+ element.id ).val( value );
                }
                if (element.className){
                    $('#'+ element.id ).addClass( element.className || '' );
                }
                if (element.type==="checkbox") {
                    $("#"+ element.id).prop('checked', (value === "true") );
                }
                if (element.html5==="range"){
                    $("#"+ element.id).trigger("change");
                }
            }
            function createSelectRow(element){

                var value = options.getItemValue(element.name) || element.value,
                    $row = $("<p />").appendTo(element.parent);
                $row
                    .addClass('settings__form-row settings__form-row--'+ type);

                if (element.type === "select"){
                    $row
                        .append('<label for="'+ element.id +'" class="settings__form-label settings__form-label--'+type+'">'+ element.label +'</label>')
                        .append('<select id="'+ id +'" name="'+ name +'">'+ getOptionsHTML(element.options) +'</select>');
                    if (value){
                        $('#'+ element.id ).val( value );
                    }
                } else {
                    $row
                        .append('<strong class="settings__form-label settings__form-label--radio">'+ element.label +'</strong>')
                        .append( getRadioHTML(element.options, element.name) );
                    if (value){
                        $("[name='"+ element.name +"'][value='"+ value  +"']").prop("checked", true );
                    }
                }
            }
            function getOptionsHTML(options,html){
                var html = "";
                for (var name in options){
                    if (options.hasOwnProperty(name)){
                        html += '<option value="'+ name +'">'+ options[name] +'</option>';
                    }
                }
                return html;
            }
            function getRadioHTML(options, elementname){
                var id, key, html = "";
                for (key in options){
                    if (options.hasOwnProperty(key)){
                        id = elementname +"__"+ key;
                        html += '<label class="settings__form-label settings__form-label--radio" for="'+ id +'"><input class="settings__form-item settings__form-item--radio" id="'+ id +'" type="radio" name="'+ elementname +'" value="'+ key +'">'+ options[key] +'</label>';
                    }
                }
                return html;
            }
            for (var i = 0; i<options.ops.length; i++){

                var item = options.ops[i],
                    element = {},
                    hidden = (item.hidden) ? "hidden" : "relative",
                    type = item.html5 || item.type || "text",
                    name = item.name,
                    id = item.id || item.name +"-"+ +new Date,
                    opsStr = opsToString(item.ops),
                    value = options.getItemValue(item.name) || item.value || "",
                    parent, $form, $nav, className = 'settings__form-item '+ hidden +' '+ item.name +'_container settings__form-item--'+ item.type ;

                element = {
                    id: id,
                    ops: [],
                    data: [],
                    value: "",
                    position: hidden
                }
                $.extend(element, item);
                if (!!element.attrs){
                    try {
                        element.attrs = item.attrs = JSON.parse(element.attrs);
                    } catch(e){
                        console.log("invalid JSON item.attrs", e);
                    }
                }
                if (!!element.data){
                    try {
                        element.data = item.data = JSON.parse(element.data);
                    } catch(e){
                        console.log("invalid JSON item.data", e);
                    }
                }

                element.parent = parent = (item.parent) ? $('form fieldset.'+ item.parent) : $('form fieldset.default');
                $form = $(".settings__form");
                $nav = $(".settings__navigation-list");
                if (item.type === "button" || item.type === "checkbox" || item.type === "text" || item.type === "password" || item.type === "textarea"){
                    createDefaultRow(element);
                } else if (item.type === "select" || item.type === "radio"){
                    createSelectRow(element);
                } else if (item.type === "title"){
                    var tag = item.tag || "h2";
                    $(parent)
                        .append('<'+ tag +' id="'+ id +'">'+ item.label +'</'+tag+'>');
                    $('#'+ id ).addClass( item.className || '' );
                } else if (item.type === "key-value"){
                    var tag = item.tag || "div";
                    $(parent)
                        .append('<div id="'+ id +'"></div>');
                    $('#'+ id )
                        .addClass( item.className || '' )
                        .data("cols", item.cols )
                        .data("type", "key-value");
                    if (item.lable){
                        $('#'+ id ).append('<'+ tag +'>'+ item.label +'</'+tag+'>');
                    }
                } else if (item.type === "fieldset"){
                    if (!document.querySelector("#"+ id)){
                        $form.append('<fieldset class="settings__section '+ id +'" id="'+ id +'"><h2 class="section__heading">'+ item.label +'</h2></fildset>');
                        $nav.append('<li class="settings__navigation-item settings__navigation-item--'+ id +'"><a class="settings__navigation-link" href="#'+ id +'">'+ item.label +'</a></li>');
                    }
                }
            }
            function opsToString(ops){
                // if (!ops){return "";}
                // var str = "";
                // for (var name in ops){
                //     if (ops.hasOwnProperty(name)){
                //         str+= name +'="'+ ops[name] +'"';
                //     }
                // }
                // return str;
            }
        },
        /**
         * Method, shows the correct section depending on which tab was clicked
         * @id navigate
         * @return void
         */
        navigate:function(e){
            $(".settings__section").addClass("hidden");
            $(".settings__navigation li.selected").removeClass('selected');
            $(e.target.hash).removeClass("hidden");
            $(e.target).parent("li").addClass("selected");
            e.preventDefault();
        },
        columnInfoViewModelInit:function(settings){
            $("[data-type='key-value']").append('<table class="data"><thead><tr><th>key</th><th>value</th></tr></thead><tbody data-bind="foreach: pairs"><tr><td><input type="text" class="displayonly filterId" data-bind="value: id" /></td><td><input type="text" class="displayonly filterTitle" data-bind="value: title" /></td><td><img class="displayonly" data-bind="click: $root.removePair"  src="lib/i/trash.png"/></td></tr></tbody><tfoot><tr><td></td><td></td><td><button class="displayonly" data-bind="click: addPair, enable: pairs().length < 12">Add pair</button></td></tr></tfoot></table>');
            $("[data-type='key-value']").on('keyup','input[type=text]', function(){ $("img.savecolumnconfig").addClass("inedit"); });
            ko.applyBindings(new options.ColumnInfoViewModel());
        },
        ColumnInfoViewModel:function(){
            var self = this,
                rawData = backgroundPage.options.getLocalStore("ColumnInfo",'[{"id":"id","title":"Title"}]'),
                data = JSON.parse(rawData),
                mapped = $.map(data, function(item) { return new Pair(item.id,item.title) ;});

            self.pairs = ko.observableArray(mapped);

            // Editable data
            self.pairs();

            self.pairs.subscribe(function( ) {
                //backgroundPage.options.setLocalStore("ColumnInfo", ko.toJSON(self.jiraFilters) );
            });

            // Operations
            self.addPair = function() {
                self.pairs.push(new Pair('',''));
                $("img.savecolumnconfig").addClass("inedit");
            };
            self.save = function(){
                $("img.savecolumnconfig").removeClass("inedit");
                backgroundPage.options.setLocalStore("ColumnInfo", ko.toJSON(self.pairs) );
            };
            self.removePair = function(item) {
                self.pairs.remove(item) ;
            };
            self.pairs.subscribe(function( ) {
                self.save();
            });


            function Pair(id, title){
                this.id = ko.observable(id);
                this.title = ko.observable(title);
                this.id.subscribe(function(){self.save();});
                this.title.subscribe(function(){self.save();});
            }

        }
    };


$(document).ready(function(){
    var section;
    $(document).on('dblclick', "*.allowDblClickReset", options.handleDblClick);
    $(document).on('click', "input:not(.displayonly), button:not(.displayonly)", options.handleClick);
    $(document).on('keyup', "input:not(.displayonly), textarea:not(.displayonly)", options.handleKeyup);
    $(document).on('change', "select, input:not(.displayonly)", options.handleValueChange);
    $(document).on('input', ".settings__form-item--range", options.handleRangeSlider);
    $(document).on('click', ".settings__navigation-link", options.navigate);
    $(document).on('change', ".settings__form-item--range", options.handleRangeChange);
    options.init(window);
    section = $(".settings__form .settings__section").first().attr("id");
    $(".settings__section").addClass("hidden");
    $(".settings__navigation-item--"+ section).addClass("selected");
    $('.json-viewer').on('click',function(e){
        e.preventDefault();
        var item, queryString;
        if (backgroundPage.options.items && backgroundPage.options.items.length){
            item = backgroundPage.options.items[0];
            queryString = encodeURIComponent( JSON.stringify( item ) );
            window.open('http://jsonlint.com/?json='+ queryString);
        } else {
            // alert("Sorry, no JSO item found, are you logged in?");
        }
    });


    $("#"+section).removeClass("hidden");
});


})(window.$, window.chrome, window.ko, window);
