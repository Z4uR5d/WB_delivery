/*
 * jqModal - Minimalist Modaling with jQuery
 *   (http://dev.iceburg.net/jquery/jqModal/)
 *
 * Copyright (c) 2007,2008 Brice Burgess <bhb@iceburg.net>
 * Copyright (c) 2013 Wildberries.ru
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 * 
 * $Version: 20/02/2013 +r20
 */
(function ($) {
    $.fn.jqm = function (o) {
        var p = {
            overlay: 70,
            overlayClass: 'jqmPopOverlay',
            closeSelector: '.close, .j-popup-close',
            trigger: '.jqModal',
            ajax: F,
            ajaxText: '',
            target: F,
            modal: F,
            toTop: true,
            onShow: F,
            onHide: F,
            onLoad: F,
            onLoadError: F,
            focusOn: 'a.close',
            topK: 2
        };
        return this.each(function () {
            if (this._jqm) return H[this._jqm].c = $.extend({}, H[this._jqm].c, o); s++; this._jqm = s;
            H[s] = { c: $.extend(p, $.jqm.params, o), a: F, w: $(this).addClass('jqmID' + s), s: s };
            if (p.trigger) $(this).jqmAddTrigger(p.trigger);
        });
    };

    $.fn.jqmAddClose = function (e) { return hs(this, e, 'jqmHide'); };
    $.fn.jqmAddTrigger = function (e) { return hs(this, e, 'jqmShow'); };
    $.fn.jqmShow = function (t) { return this.each(function () { t = t || window.event; $.jqm.open(this._jqm, t); }); };
    $.fn.jqmHide = function (t) { return this.each(function () { t = t || window.event; $.jqm.close(this._jqm, t); }); };
    $.fn.jqmCenter = function (t) { return this.each(function () { t = t || window.event; $.jqm.center(this._jqm, t); }); };

    $.jqm = {
        hash: {},
        open: function (s, t) {
            var h = H[s], c = h.c, cc = c.closeSelector, z = (parseInt(h.w.css('z-index'))), z = (z > 0) ? z : 3000, o = $('<div></div>').css({ height: '100%', width: '100%', position: 'fixed', left: 0, top: 0, 'z-index': z - 1, opacity: c.overlay / 100 }); if (h.a) return F; h.t = t; h.a = true; h.w.css('z-index', z);
            if (c.modal) { if (!A[0]) L('bind'); A.push(s); }
            else if (c.overlay > 0) h.w.jqmAddClose(o);
            else o = F;

            h.o = (o) ? o.addClass(c.overlayClass).prependTo('body') : F;
            if (cc) h.w.jqmAddClose($(cc, h.w));
            if (c.ajax) { var r = c.target || h.w, u = c.ajax, r = (typeof r == 'string') ? $(r, h.w) : $(r), u = (u.substr(0, 1) == '@') ? $(t).attr(u.substring(1)) : u; c.randomParam && (u += (u.indexOf('?') !== -1 ? '&' : '?') + c.randomParam + '=' + new Date().getTime()); r.html(c.ajaxText).load(u, function (txt, s, r) { if (s !== 'error') { if (c.onLoad) c.onLoad.call(this, h); if (cc) h.w.jqmAddClose($(cc, h.w)); ps(h); f(h); } else if (c.onLoadError) { c.onLoadError.call(this, h, txt)}  }); }

            if (c.toTop && h.o) h.w.before('<span id="jqmP' + h.w[0]._jqm + '"></span>').insertAfter(h.o);

            ps(h); h.w.show(); if (c.onShow) c.onShow(h); f(h);
            $(h.w).on('keydown', s, function (e) { if (e.keyCode == 27) { $.jqm.close(s); try { if ($('div[class*="jqmID"]:visible').first().length > 0) { f(H[$('div[class*="jqmID"]:visible').first().attr('class').match(/.*jqmID(\d+)/)[1]]); } } catch (e) { _ } return F; } });
            wn.on('resize.jqm' + s, function() {ps(h)});
            return F;
        },
        close: function (s) {
            var h = H[s]; if (!h.a) return F; h.a = F;
            if (A[0]) { A.pop(); if (!A[0]) L('unbind'); }
            if (h.c.toTop && h.o) $('#jqmP' + h.w[0]._jqm).after(h.w).remove();
            h.w.hide().removeAttr('style'); if (h.o) h.o.remove(); if (h.c.onHide) h.c.onHide(h);
            wn.off('resize.jqm' + s); return F;
        },
        params: {},
        center: function(s) {
            ps(H[s]);
        }
    };
    var s = 0, H = $.jqm.hash, A = [], F = false, wn = $(window),
    f = function (h) { try { $(h.c.focusOn ? h.c.focusOn : ':input:visible', h.w)[0].focus(); } catch (_) { } },
    L = function (t) { $()[t]("keypress", m)[t]("keydown", m)[t]("mousedown", m); },
    m = function (e) { var h = H[A[A.length - 1]], r = (!$(e.target).parents('.jqmID' + h.s)[0]); if (r) f(h); return !r; },
    ps = function (h) { h.w.css({ 'top': Math.max(0, (Math.max(wn.height() - h.w.outerHeight(), 0) / H[s].c.topK) + wn.scrollTop()) + "px", 'left': Math.max(0, ((wn.width() - h.w.outerWidth()) / 2) + wn.scrollLeft()) + "px" }); },
    hs = function (w, t, c) {
        return w.each(function () {
            var s = this._jqm; $(t).each(function () {
                if (!this[c]) { this[c] = []; $(this).click(function () { for (var i in { jqmShow: 1, jqmHide: 1 }) for (var s in this[i]) if (H[this[i][s]]) H[this[i][s]].w[i](this); return F; }); } this[c].push(s);
            });
        });
    };
    $(document).on('keydown', function (e) { if (e.keyCode == 27) { try { var fst = $('div[class*="jqmID"]:visible'); if (fst.length > 0) { $.jqm.close($(fst[0]).attr('class').match(/.*jqmID(\d+)/)[1]); if (fst.length > 1) { f(H[$(fst[1]).attr('class').match(/.*jqmID(\d+)/)[1]]); } } } catch (ex) { _ } return F; } });
})(jQuery);