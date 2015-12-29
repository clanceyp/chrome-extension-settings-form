/**
 * @author patcla
 */

(function($, chrome, ko, OPTIONS, window){
"use strict";

var backgroundPage = chrome.extension.getBackgroundPage(),
    HELP = OPTIONS.HELP,
    DEBUG = window.DEBUG,
    DEFAULT_VALUES = OPTIONS.DEFAULT_VALUES,
    FORMS = OPTIONS.FORMS,
    options = {
        ops:FORMS["settings"],
        utils:{
            getOptionsHTML:function(options,html){
                var html = "";
                for (var name in options){
                    if (options.hasOwnProperty(name)){
                        html += '<option value="'+ name +'">'+ options[name] +'</option>';
                    }
                }
                return html;
            },
            getRadioHTML:function(options, elementname){
                var id, key, html = "";
                for (key in options){
                    if (options.hasOwnProperty(key)){
                        id = elementname +"__"+ key;
                        html += '<label class="settings__form-label settings__form-label--radio" for="'+ id +'"><input class="settings__form-item settings__form-item--radio" id="'+ id +'" type="radio" name="'+ elementname +'" value="'+ key +'">'+ options[key] +'</label>';
                    }
                }
                return html;
            }
        },
        init:function(context){
            var manifest = chrome.runtime.getManifest();
            $(".header__heading").html('<span class="appName"></span> <span class="appVersion header__heading-version"></span>');
            $(".appVersion").text(manifest.version);
            $(".appName").text(manifest.name);
            options.setupForm();
            //options.columnInfoViewModelInit();
            options.setupHelp();
            options.setupNavigation();
            if (context && !context.options){
                context.options = options;
            }
        },
        setupHelp:function(){
            for (var item in HELP){
                if ( $('.'+ item + '__container').length === 1 && HELP[item]){
                    $('.'+ item + '__container').append('<button class="help"><span class="help__content"></span></button>');
                    $('.'+ item + '__container .help__content').html( HELP[item] );
                } else if (DEBUG){
                    window.console.log( item + " not found");
                }
            }
        },
        setupNavigation:function(){
            var defaultSection = ( _.findWhere(OPTIONS.FORMS.settings, {defaultSection: "true"}) ).id;
            $(".settings__section").addClass("hidden");
            $("#"+defaultSection).removeClass("hidden");
            $(".settings__navigation-item--"+ defaultSection).addClass("selected");
        },
        getItemValue:function(key){
            return backgroundPage.options.getLocalStore(key);
        },
        get:function(key){
            alert('depriacted, use options.getItemValue')
            // return options.getItemValue(key);
        },
        saveItemValue:function(target){
            if (DEBUG)
                console.log("saveItemValue", target)
            if (!target){return true;}
            var id = $(target).attr("id"),
                name =  $(target).attr("name"),
                value = $(target).val(),
                type = $(target).attr('type');
                if (DEBUG)
                    console.log("id", id, "name", name, "value", value, "type", type);
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
                if(confirm("Do you really want to loose all your current settings by resetting to default values?")) {
                    options.resetForm();
                }
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
        createRow: {
            basic: function(element){
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
                    if (DEBUG)
                        console.log(op, element.ops[op]);
                    $('#'+ element.id ).attr(op, element.ops[op]);
                });$.each(element.data, function(op, i){
                    if (DEBUG)
                        console.log(op, element.ops[op]);
                    $('#'+ element.id ).data(op, element.data[op]);
                });
                if (DEBUG)
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
            },
            keyValue: function(element){
                var data = element.data,
                    id = element.id;
                if (id.match(/\W/)){
                    alert("Sorry, "+ element.name +" must have an id which just contains word characters only [^a-zA-Z0-9_] ");
                } else if (document.querySelectorAll("#"+ id).length > 1){
                    alert("Sorry, "+ element.name +" must have a unique id");
                } else if (!data || !data.cols || data.cols.length !==2 || !data.cols[0].title || !data.cols[1].title  ){
                    alert("Sorry, please specify a title for each column");
                }else{
                    // everything seems to be OK
                    // options.columnInfoViewModelInit(element);
                    var caption = element.label ? '<thead><caption class="settings__form-label">'+ element.label +'</caption></thead>' : '';

                    $("#"+ id).append('<table id="table-'+id+'" class="data">' + caption + '<tr><th>'+ data.cols[0].title +'</th><th>'+ data.cols[1].title +'</th></tr><tbody data-bind="foreach: pairs"><tr><td><input type="text" class="displayonly filterId" data-bind="value: key" /></td><td><input type="text" class="displayonly filterTitle" data-bind="value: value" /></td><td><img class="displayonly" data-bind="click: $root.removePair"  src="lib/options/i/trash.png"/></td></tr></tbody><tfoot><tr><td></td><td></td><td><button class="displayonly" data-bind="click: addPair">Add pair</button></td></tr></tfoot></table>');
                    ko.applyBindings(new options.ColumnInfoViewModel(element), document.getElementById("table-"+id));
                }
            },
            select: function(element){
                var value = options.getItemValue(element.name) || element.value,
                    $row = $("<p />").appendTo(element.parent),
                    type = element.type,
                    id = element.id,
                    name = element.name;
                $row
                    .addClass('settings__form-row settings__form-row--'+ type);

                if (element.type === "select"){
                    $row
                        .append('<label for="'+ element.id +'" class="settings__form-label settings__form-label--'+type+'">'+ element.label +'</label>')
                        .append('<select id="'+ id +'" name="'+ name +'">'+ options.utils.getOptionsHTML(element.options) +'</select>');
                    if (value){
                        $('#'+ element.id ).val( value );
                    }
                } else {
                    $row
                        .append('<strong class="settings__form-label settings__form-label--radio">'+ element.label +'</strong>')
                        .append( options.utils.getRadioHTML(element.options, element.name) );
                    if (value){
                        $("[name='"+ element.name +"'][value='"+ value  +"']").prop("checked", true );
                    }
                }
            }
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
                    if (DEBUG)
                        console.log(op, element.ops[op]);
                    $('#'+ element.id ).attr(op, element.ops[op]);
                });$.each(element.data, function(op, i){
                    if (DEBUG)
                        console.log(op, element.ops[op]);
                    $('#'+ element.id ).data(op, element.data[op]);
                });
                if (DEBUG)
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
                    $row = $("<p />").appendTo(element.parent),
                    type = element.type;
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
                    position: hidden,
                    type: type
                }
                $.extend(element, item);
                if (!!element.attrs){
                    try {
                        element.attrs = item.attrs = JSON.parse(element.attrs);
                    } catch(e){
                        if (DEBUG)
                            console.log("invalid JSON item.attrs", e);
                    }
                }
                if (!!element.data && typeof element.data === 'string' ){
                    try {
                        element.data = item.data = JSON.parse(element.data);
                    } catch(e){
                        if (DEBUG)
                            console.log("invalid JSON item.data", e);
                    }
                }

                element.parent = parent = (item.parent) ? $('form fieldset.'+ item.parent) : $('form fieldset.default');
                $form = $(".settings__form");
                $nav = $(".settings__navigation-list");
                if (item.type === "button" || item.type === "checkbox" || item.type === "text" || item.type === "password" || item.type === "textarea"){
                    // createDefaultRow(element);
                    options.createRow.basic(element)
                } else if (item.type === "select" || item.type === "radio"){
                    // createSelectRow(element);
                    options.createRow.select(element);
                } else if (item.type === "title"){
                    var tag = item.tag || "h2";
                    $(parent)
                        .append('<'+ tag +' id="'+ id +'">'+ item.label +'</'+tag+'>');
                    $('#'+ id ).addClass( item.className || '' );
                } else if (item.type === "key-value"){
                    var tag = item.tag || "div";
                    $(parent)
                        .append('<'+ tag +' id="'+ id +'"></'+ tag +'>');
                    $('#'+ id )
                        .addClass( item.className || '' )
                        .data("type", "key-value");
                    options.createRow.keyValue(element);
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
        //columnInfoViewModelInit:function(element){
        //    var id = element.id,
        //        data = element.data,
        //        caption = element.label ? '<thead><caption class="settings__form-label">'+ element.label +'</caption></thead>' : '';
        //
        //    $("#"+ id).append('<table id="table-'+id+'" class="data">' + caption + '<tr><th>'+ data.cols[0].title +'</th><th>'+ data.cols[1].title +'</th></tr><tbody data-bind="foreach: pairs"><tr><td><input type="text" class="displayonly filterId" data-bind="value: key" /></td><td><input type="text" class="displayonly filterTitle" data-bind="value: value" /></td><td><img class="displayonly" data-bind="click: $root.removePair"  src="lib/options/i/trash.png"/></td></tr></tbody><tfoot><tr><td></td><td></td><td><button class="displayonly" data-bind="click: addPair">Add pair</button></td></tr></tfoot></table>');
        //    ko.applyBindings(new options.ColumnInfoViewModel(element), document.getElementById("table-"+id));
        //},
        ColumnInfoViewModel:function(element){
            var _this = this,
                id = element.id,
                defaultKeyValue = element.data.cols[0].defaultValue || "",
                defaultValue = element.data.cols[1].defaultValue || "",
                initKeyValue = element.data.cols[0].initValue || defaultKeyValue,
                initValue = element.data.cols[1].initValue || defaultValue,
                rawData = backgroundPage.options.getLocalStore( id ,'[{"key":"'+ initKeyValue +'","value":"'+ initValue +'"}]'),
                data = JSON.parse(rawData),
                mapped = $.map(data, function(item) { return new Pair(item.key,item.value) ;});

            _this.pairs = ko.observableArray(mapped);

            // Editable data
            _this.pairs();

            // Operations
            _this.addPair = function() {
                _this.pairs.push(new Pair( defaultKeyValue , defaultValue));
                $("#"+id+" .savecolumnconfig").addClass("inedit");
            };
            _this.save = function(){
                $("#"+id+" .savecolumnconfig").removeClass("inedit");
                var emptiesRemoved = _.reject(ko.toJS(_this.pairs), function(item){return !item.key && !item.value});
                backgroundPage.options.setLocalStore(id, ko.toJSON(emptiesRemoved) );
            };
            _this.removePair = function(item) {
                _this.pairs.remove(item) ;
            };
            _this.pairs.subscribe(function( ) {
                _this.save();
            });


            function Pair(key, value){
                this.key = ko.observable(key);
                this.value = ko.observable(value);
                this.key.subscribe(function(){_this.save();});
                this.value.subscribe(function(){_this.save();});
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
});


})(window.$, window.chrome, window.ko, window.OPTIONS, window);
