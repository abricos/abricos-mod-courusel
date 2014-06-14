/*!
 * Copyright 2014 Alexander Kuzmin <roosit@abricos.org>
 * Licensed under the MIT license
 */

var Component = new Brick.Component();
Component.requires = {
    yui: ['base'],
    mod: [
        {name: 'sys', files: ['application.js', 'widget.js']},
        {name: 'widget', files: ['notice.js']},
        {name: '{C#MODNAME}', files: ['roles.js', 'structure.js']}
    ]
};
Component.entryPoint = function(NS){

    var Y = Brick.YUI,

        WAITING = 'waiting',
        BOUNDING_BOX = 'boundingBox',

        COMPONENT = this,

        SYS = Brick.mod.sys;

    NS.AppWidget = Y.Base.create('appWidget', Y.Widget, [
        SYS.Language,
        SYS.Template,
        SYS.WidgetClick,
        SYS.WidgetWaiting
    ], {
        initializer: function(){
            this._appWidgetArguments = Y.Array(arguments);

            Y.after(this._syncUIAppWidget, this, 'syncUI');
        },
        _syncUIAppWidget: function(){
            var args = this._appWidgetArguments,
                tData = {};

            if (Y.Lang.isFunction(this.buildTData)){
                tData = this.buildTData.apply(this, args);
            }

            var bBox = this.get(BOUNDING_BOX),
                defTName = this.template.cfg.defTName;

            bBox.setHTML(this.template.replace(defTName), tData);

            this.set(WAITING, true);

            var instance = this;
            NS.initApp(function(){
                instance._initAppWidget();
            });
        },
        _initAppWidget: function(){
            this.set(WAITING, false);

            var args = this._appWidgetArguments
            if (Y.Lang.isFunction(this.onInitAppWidget)){
                this.onInitAppWidget.apply(this, args);
            }
        }
    }, {
        ATTRS: {
            render: {
                value: true
            }
        }
    });

    var AppBase = function(){
    };
    AppBase.prototype = {
        /*
         login: function(login, callback, context){
         var instance = this;
         instance.ajax({
         'do': 'login',
         'savedata': login.toJSON()
         }, instance._onLogin, {
         context: instance,
         arguments: {callback: callback, context: context }
         });
         },
         _onLogin: function(err, res, details){
         var callback = details.callback,
         context = details.context;

         if (!err){
         var errorCode = res.data.err || 0;
         if (errorCode > 0){
         var phId = 'ajax.login.error.' + errorCode;

         err = {
         code: errorCode,
         msg: this.language.get(phId)
         };
         }
         }

         if (callback){
         if (err){
         callback.apply(context, [err]);
         } else {
         callback.apply(context, [null, res.data]);
         }
         }
         }
         /**/
    };
    NS.AppBase = AppBase;

    var App = Y.Base.create('couruselApp', Y.Base, [
        SYS.AJAX,
        SYS.Language,
        NS.AppBase
    ], {
    }, {
        ATTRS: {
            component: {
                value: COMPONENT
            }
        }
    });
    NS.App = App;

    NS.URL = {
        ws: "#app={C#MODNAMEURI}/wspace/ws/",
        manager: {
            view: function(){
                return NS.URL.ws + 'manager/ManagerWidget/'
            }
        }
    };

    NS.appInstance = null;
    NS.initApp = function(callback){
        callback || (callback = function(){
        });

        if (NS.appInstance){
            return callback(null, NS.appInstance);
        }
        NS.appInstance = new NS.App({
            moduleName: '{C#MODNAME}'
        });
        callback(null, NS.appInstance);
    };

};