var builder_helper = this.ec_builder_helper || (this.ec_builder_helper = {});
var ec_utils_helper = builder_helper.Utils || (builder_helper.Utils = {});
var ec_functions_helper = builder_helper.Functions || (builder_helper.Functions = {});
var ec_settings_helper = builder_helper.Settings || (builder_helper.Settings = {});
var ec_templates_helper = builder_helper.Templates || (builder_helper.Templates = {});

var make_image_proper_size=function () {
  var __email_width=jQuery('#settings-email-width').val();

  jQuery('.image-a').each(function () {
    jQuery(this).find('.img').css('max-width',__email_width+'px');
  });
}

var jsonParse = function (jsonStr) {
    var __json = jsonStr;
    try {
        __json = JSON.parse(jsonStr);
    } catch (e) {

    }
    return __json;
}

var ec_woo_debug = false;
/*
 * For sending AJAX request
 */

var shortcode_list = {};

var generate_shortcode_for_all_text = function () {
    jQuery('.ec-preview-content-sortable-column[data-settings-type="text"]').each(function () {
        var __self = jQuery(this);
        var __body = __self.find('.ec-preview-content-sortable-column-body');
        var __generate = do_shortcode(__body.html());
        __body.html(__generate);
    });
}

var generate_shortcode = function (key, value) {
    var __span_tag_list = [
        '[ec_woo_site_name]',
        '[ec_woo_order_date]',
        '[ec_woo_order_time]',
        '[ec_woo_order_datetime]',
        '[ec_woo_order_link]',
        '[ec_woo_user_name]',
        '[ec_woo_billing_first_name]',
        '[ec_woo_billing_last_name]',
        '[ec_woo_user_id]',
        '[ec_woo_user_email]',
        '[ec_woo_shipping_first_name]',
        '[ec_woo_shipping_last_name]',
        '[ec_woo_billing_phone]',
        '[ec_woo_order_id]',
        '[ec_woo_billing_email]',
        '[ec_woo_order_delivery_date]'
    ];
    ;
    var __result = '';
    // if (__span_tag_list.indexOf(key) > -1) {
    //   __result = '<span data-shortcode="' + key + '">' + value + '</span>';
    // } else {
    //   __result = '<div data-shortcode="' + key + '">' + value + '</div>';
    // }
    __result = '<span data-shortcode="' + key + '">' + value + '</span>';
    return __result;
}
var check_has_shortcode = function (_shortcode) {
    // if ((/ec_woo_related_items/).test(_shortcode))
    //     return true;

    // if ((/type='([^"]*)'/).test(_shortcode))
    //     return true;
}
var do_shortcode = function (value) {
    value = value.split('<p').join('<div');
    value = value.split('</p>').join('</div>');

    var result = value.match(/\[([\w-]+)([^]*?)(\/?)\]/g);
    for (var index in result) {
      (function () {
        var _shortcode = result[index];
        var _has_type = !!check_has_shortcode(_shortcode);
        if (_has_type===true) {
            // var data = {
            //     action: 'generate_shortcode',
            //     shortcode: _shortcode.split("'").join('"')
            // };
            // ajax_request(data, function (response) {
            //     shortcode_list[_shortcode] = response.data;
            //     var __generated_shortcode = generate_shortcode(_shortcode, shortcode_list[key]);
            //     value = _join(value.split(key), __generated_shortcode);
            //     // for (var key in shortcode_list) {
            //     //     if (value.indexOf(key) > -1) {
            //     //         var __generated_shortcode = generate_shortcode(key, shortcode_list[key]);
            //     //         value = _join(value.split(key), __generated_shortcode);
            //     //     }
            //     // }
            // });
          }
        })(index);
    }
    for (var key in shortcode_list) {
        if (value.indexOf(key) > -1) {
            var __generated_shortcode = generate_shortcode(key, shortcode_list[key]);
            value = _join(value.split(key), __generated_shortcode);
        }
    }
    return value;
}
var _join = function (arr, value) {
    var result = '';
    for (var i = 0; i < arr.length; i++) {
        //console.log(arr[i]);
        if (arr[i].length > 0) {
            result += arr[i];
        }
        if (i != (arr.length - 1)) {
            result += value;
        }
    }
    return result;
}

/*
 * For sending AJAX request
 */
var ajax_request = function (data, success_callback, fail_callback) {

    var _ajax_url = woo_ec_vars.ajax_url;

    data.development = ec_woo_debug == true ? 1 : 0;

    var jqxhr = jQuery.post(_ajax_url, data);

    jqxhr.done(function (response) {
        if (ec_woo_debug) {
            console.log('jqxhr.done', response);
        }

        response = jsonParse(response);

        if (response.code == 200) {
            if (success_callback !== undefined) {
                success_callback(response);
            }
        } else {
            if (fail_callback !== undefined) {
                fail_callback(response);
            }

            iziToast.error({
                title: 'Error',
                message: response.message,
                position: 'bottomRight'
            });
        }
    });

    jqxhr.fail(function (response) {
        if (ec_woo_debug) {
            console.log('jqxhr.fail', response);
        }
        iziToast.error({
            title: 'Request failed',
            message: "Please check <b>logs</b> in the plugin's folder",
            position: 'bottomRight'
        });
        if (fail_callback !== undefined) {
            fail_callback(response);
        }
    });

}

var enable_save_template = function () {
    jQuery('.ec-preview-header-control-item.ec-control-save').removeClass('ec-control-save-disabled');
}



var scrollTop = function () {
    setTimeout(function () {
        window.scrollTo(0, 0);
    }, 200);
}

var builder = this.ec_builder || (this.ec_builder = {});
var utils = builder.Utils || (builder.Utils = {});
var functions = builder.Functions || (builder.Functions = {});
var settings = builder.Settings || (builder.Settings = {});
var templates = builder.Templates || (builder.Templates = {});

jQuery(document).on('click', '.ec-activate-modal', function () {
    jQuery('.ec-activate-updates-skip-container').hide();
    jQuery('#modal-activate').fadeIn();
});

jQuery(function () {
    jQuery('body').addClass('ec-body');

    jQuery('#footer-thankyou,#footer-upgrade').remove();
    jQuery('#ec_woo_order').change();

    setTimeout(function () {
        jQuery('#ec_woo_save_as_lang').addClass('ec-modal-input');
        jQuery('#ec_woo_save_as_lang').css('width', '30%');
    }, 100);

    if (woo_ec_vars.show_activate_updates == true) {
        jQuery('#modal-activate').fadeIn();
    }

    // var _top = jQuery('.ec-wrapper').position().top;
    // if (_top == 0) {
    //   jQuery('.ec-builder-header').css('margin-top', '32px');
    // } else if (_top > 32) {
    //   jQuery('.ec-builder-header').css('margin-top', '32px');
    // }
    var __height = jQuery('#wpadminbar').height() + jQuery('.ec-builder-header').height();
    jQuery('.ec-preview').css('margin-top', __height + 'px');

    scrollTop();


    var _is_demo = woo_ec_vars.is_demo;
    if (_is_demo) {
        var introguide = introJs();

        introguide.setOptions({
            showProgress: false
        });

        introguide.start();
    }


    var header_height = jQuery('.ec-builder-header').height() + jQuery('#wpadminbar').height();
    var total_height = jQuery(window).height();
    var height = Math.floor(((total_height - header_height) * 100) / total_height);

    jQuery('.ec-wrapper .ec-preview-content').css('height', (height - 2) + 'vh');

    setTimeout(function () {
        jQuery('.rangeSlider').remove();
        jQuery('.ec-panel-settings-slider').attr('style', '');
    }, 500);
});

jQuery(document).on('change', '.ec-settings-menu', function () {
    var _val = jQuery(this).val();
    var _data = {
        action: 'save_panel_position',
        position: _val
    };

    ajax_request(_data, function () {
        iziToast.success({
            title: 'Success!',
            message: 'Saved panel position',
            position: 'bottomRight'
        });
        jQuery('.ec-builder-header').attr('style', '');
        jQuery('.ec-panel').attr('style', '');

        if (_val === 'left') {
            jQuery('.ec-wrapper').removeClass('ec-panel-right');
        } else {
            jQuery('.ec-wrapper').addClass('ec-panel-right');
            jQuery('.ec-preview').css('margin-left', '');
        }
    });
});

jQuery(document).on('click', '.ec-modal-library-grid-item .ec-modal-library-grid-row', function () {
    var _self = jQuery(this);
    var _parent = _self.parent();
    var _list = _parent.find('.ec-modal-library-grid-item-list');

    if (_parent.hasClass('collapsed')) {
        _list.slideDown(300, function () {
            _parent.removeClass('collapsed');
        });
    } else {
        _list.slideUp(300, function () {
            _parent.addClass('collapsed');
        });
    }

});
jQuery(document).on('click', '#settings-image-change', function () {
    if (window_media === undefined) {
        var window_media = wp.media({
            title: 'Select a media',
            library: {
                type: 'image'
            },
            multiple: false,
            button: {
                text: 'Select'
            }
        });

        var self = this; // Needed to retrieve our variable in the anonymous function below
        window_media.on('select', function () {
            var first = window_media.state().get('selection').first().toJSON();
            jQuery('#settings-image-source-url').val(first.url);
            jQuery('#settings-image-source-url').change();
        });
    }

    window_media.open();
});

jQuery(document).on('click', '.ec-modal-input-container.active #ec-import-submit', function () {
    var __self = jQuery(this);

    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var $label = __self.find('.ec-modal-input-submit-label');
    var $loading = __self.find('.ec-modal-input-submit-loading');

    __self.addClass('ec-clicked');
    $label.hide();
    $loading.show();

    var file_data = jQuery('#import-file').prop('files')[0];
    var _ajax_url = woo_ec_vars.ajax_url;


    var form_data = new FormData();
    form_data.append('import_file', file_data);
    form_data.append('action', 'import_json');
    jQuery.ajax({
        url: _ajax_url,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function (response) {
            data = jsonParse(response.data);
            functions.import_json(data, true);
            jQuery('#modal-import').fadeOut();
            __self.removeClass('ec-clicked');
            $label.show();
            $loading.hide();
            changeImgWidthOnLoadedTemplate();
        }
    });
});

jQuery(document).on('click', '.ec-modal-input-container.active #ec-import-all-submit', function () {
    var __self = jQuery(this);

    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var $label = __self.find('.ec-modal-input-submit-label');
    var $loading = __self.find('.ec-modal-input-submit-loading');
    var $labelError = jQuery('#ec-import-all-file-error');

    __self.addClass('ec-clicked');
    $label.hide();
    $loading.show();

    var file_data = jQuery('#import-all-file').prop('files')[0];
    var _ajax_url = woo_ec_vars.ajax_url;


    var form_data = new FormData();
    form_data.append('import_file', file_data);
    form_data.append('action', 'import_all');
    jQuery.ajax({
        url: _ajax_url,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function (response) {
            data = jsonParse(response);
            if (data.code!=200) {
              $label.show();
              $loading.hide();
              $labelError.text('Could not read JSON file');
              $labelError.show();
            }

            jQuery('#modal-import-all').fadeOut();
            __self.removeClass('ec-clicked');
            $label.show();
            $loading.hide();

        }
    });
});

jQuery(document).on('click', '#ec-email-submit', function () {
    var __self = jQuery(this);
    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var $email = jQuery('#ec-email-address');

    if ($email.val() == '') {
        $email.addClass('ec-modal-input-has-error');
        return false;
    }
    $email.removeClass('ec-modal-input-has-error');
    var $loading = jQuery('.ec-modal-input-submit-loading');
    var $label = jQuery('.ec-modal-input-submit-label');

    var __html = functions.export_html(false);
    var _data = {
        action: 'send_email',
        email: $email.val(),
        lang: jQuery('#ec_woo_lang').val(),
        order_id: jQuery('#ec_woo_order').val(),
        email_type: jQuery('#ec_woo_type').val(),
        html: __html
    };

    $label.hide();
    $loading.show();
    __self.addClass('ec-clicked');

    ajax_request(_data, function () {
        iziToast.success({
            title: 'Sent email!',
            message: 'Please check your email address',
            position: 'bottomRight'
        });

        $label.show();
        $loading.hide();
        __self.removeClass('ec-clicked');

        jQuery('#modal-send-email').fadeOut();

    }, function () {
        $label.show();
        $loading.hide();
        __self.removeClass('ec-clicked');
    });
});
var shortcode_docs;
var __load_template = function () {
    // utils.remove_modal(function() {
    //   console.log('yessss');
    // });
    if (jQuery('.ec-tab-styles').hasClass('ec-active')) {
        jQuery('.ec-panel-header-icon').click();
    }
    jQuery('.ec-preview').addClass('ec-loading');
    jQuery('.ec-preview-content-wrapper').hide();

    if (jQuery('#ec_woo_type').val()=='') {
      jQuery('.ec-preview-content-wrapper').show();
      jQuery('.ec-preview').removeClass('ec-loading');
      return;
    }
    var data = {
        action: 'template_load',
        lang: jQuery('#ec_woo_lang').val(),
        type: jQuery('#ec_woo_type').val(),
        order_id: jQuery('#ec_woo_order').val()
    };

    ajax_request(data, function (response) {
        //response = jsonParse(response);
        shortcode_list = response.shortcode_data;
        shortcode_docs = response.shortcode_json;

        if (response.replace_email == '1') {
            jQuery('#ec-settings-replace-mail-for-type').prop("checked", true);
        } else {
            jQuery('#ec-settings-replace-mail-for-type').prop("checked", false);
        }

        settings.tinymce_tags = jsonParse(response.shortcode_json);
        functions.tinymce_generate(response.shortcode_json);
        functions.settings_text_helper();

        for (var i = 0; i < utils.loadFuntions.length; i++) {
            utils.loadFuntions[i]();
        }
        var __email = response.email;
        if (__email != undefined) {
            if (__email.length > 0) {
                functions.import_json(jsonParse(__email), true);
                generate_shortcode_for_all_text();
            } else {
                utils.load_default_row();
            }

        } else {
            utils.load_default_row();
        }
        jQuery('.ec-preview-content-wrapper').show();
        jQuery('.ec-preview').removeClass('ec-loading');
        changeImgWidthOnLoadedTemplate();

    });
}

var changeImgWidthOnLoadedTemplate=function () {
  jQuery('#settings-email-width').change();
}

jQuery(document).on('change', '#ec_woo_type', function () {

    var $type = jQuery('#ec_woo_type');
    if ($type.val() != '') {
        __load_template();
        $type.find('option[value=""]').remove();
        enable_save_template();
        check_email_rtl_support();
        jQuery('.ec-woo-replace-email-type').text("'" + jQuery("#ec_woo_type option:selected").text().trim() + "'");
    }

    //collapse settings panel
    jQuery('.ec-panel-tab-content-item[data-tab="settings"] .ec-panel-settings-item').addClass('collapsed');
    jQuery('.ec-panel-tab-content-item[data-tab="settings"] .ec-panel-settings-content').hide();
    // open first one
    jQuery('#ec-woo-email-settings-panel').removeClass('collapsed').addClass('active');
    jQuery('#ec-woo-email-settings-panel .ec-panel-settings-content').show();


});
jQuery(document).on('change', '#ec_woo_order', function () {
    __load_template();
});
jQuery(document).on('change', '#ec_woo_lang', function () {
    __load_template();
});

jQuery(document).on('click', '.ec-preview-header-control-item.ec-control-save', function () {
    if (woo_ec_vars.is_demo == true) {
        alert('DEMO ! You cannot change it !')
        return false;
    }
    var __self = jQuery(this);
    if (__self.hasClass('ec-control-save-disabled')) {
        return false;
    }

    var $loading = jQuery('.ec-save-loading');
    var $label = jQuery('.ec-save-label');
    __self.addClass('ec-control-save-disabled');

    var __exported_json = functions.export_json();
    var data = {
        action: 'template_save',
        lang: jQuery('#ec_woo_lang').val(),
        type: jQuery('#ec_woo_type').val(),
        email: __exported_json//btoa(unescape(encodeURIComponent(__exported_json)))
    };

    $label.hide();
    $loading.show();

    ajax_request(data, function (response) {

        $label.show();
        $loading.hide();
        __self.removeClass('ec-control-save-disabled');
        iziToast.success({
            title: 'Success!',
            message: 'Template saved successfully',
            position: 'bottomRight'
        });
    });
});


jQuery(document).on('click', '#ec-modal-template-save', function () {
    var __self = jQuery(this);

    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var $label = __self.find('.ec-modal-input-submit-label');
    var $loading = __self.find('.ec-modal-input-submit-loading');
    var $name = jQuery('#ec-modal-template-name');

    if ($name.val().length == 0) {
        $name.addClass('ec-modal-input-has-error');
        return false;
    }

    $name.removeClass('ec-modal-input-has-error');
    __self.addClass('ec-clicked');
    $label.hide();
    $loading.show();

    var __html = functions.export_json();

    var data = {
        action: 'template_new_save',
        email: __html,
        name: $name.val()
    };

    ajax_request(data, function (response) {
        load_saved_templates(function () {
            jQuery('#modal-save').hide();
            jQuery('#modal-library .ec-modal-library-content').show();
            jQuery('#modal-library .ec-modal-library-preview').hide();

            jQuery('#modal-library').show();
            jQuery('.ec-modal-library-tabs-item[data-content="#modal-library-my-templates"]').click();

            $name.val('');
            __self.removeClass('ec-clicked');
            $label.show();
            $loading.hide();
        });


    });

});


jQuery(document).on('click', '.ec-modal-library-grid-action-item.ec-modal-library-grid-action-delete', function () {
    var __self = jQuery(this);
    var __row = __self.parents('.ec-modal-library-grid-row');

    var $controls = __row.find('.ec-modal-library-grid-action-list');
    var $loading = __row.find('.ec-modal-library-grid-action-loading');

    $controls.hide();
    $loading.show();

    var data = {
        action: 'template_delete_saved',
        id: __row.attr('data-id')
    };


    ajax_request(data, function (response) {
        iziToast.success({
            title: 'SUCCESS',
            message: 'Template deleted',
            position: 'bottomRight'
        });
        __row.remove();

    }, function () {
        $controls.show();
        $loading.hide();
    });

});


jQuery(document).on('click', '.ec-modal-library-grid-action-item.ec-modal-library-grid-action-insert', function () {
    var __self = jQuery(this);
    var __row = __self.parents('.ec-modal-library-grid-row');

    var $controls = __row.find('.ec-modal-library-grid-action-list');
    var $loading = __row.find('.ec-modal-library-grid-action-loading');
    var $modal = jQuery('#modal-library');


    var _id = __row.attr('data-id');
    $controls.hide();
    $loading.show();

    setTimeout(function () {
        var _data = jsonParse(utils.saved_templates.where(_id)[0].data);

        functions.import_json(_data, true);
        generate_shortcode_for_all_text();

        $controls.show();
        $loading.hide();
        $modal.fadeOut();
    }, 300);


});


jQuery(document).on('click', '#ec-modal-template-save-as', function () {
    var __self = jQuery(this);
    var $type = jQuery('#ec_woo_save_as_email_type');
    var $lang = jQuery('#ec_woo_save_as_lang');
    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var has_error = false;
    // if ($lang.val() == '') {
    //   has_error = true;
    //   $lang.addClass('ec-modal-input-has-error');
    // }
    if ($type.val() == '') {
        has_error = true;
        $type.addClass('ec-modal-input-has-error');
    }

    if (has_error == true) {
        return false;
    }

    $type.removeClass('ec-modal-input-has-error');
    var $loading = jQuery('.ec-modal-input-submit-loading');
    var $label = jQuery('.ec-modal-input-submit-label');

    var __exported_json = functions.export_json();
    var data = {
        action: 'template_save_as',
        lang: $lang.val(),
        type: $type.val(),
        email: __exported_json
    };

    $label.hide();
    $loading.show();
    __self.addClass('ec-clicked');

    ajax_request(data, function (response) {

        $label.show();
        $loading.hide();
        __self.removeClass('ec-clicked');
        jQuery('#modal-save-as').fadeOut();
        iziToast.success({
            title: 'Success!',
            message: 'Saved successfully',
            position: 'bottomRight'
        });
    });
});


jQuery(document).on('change', '#ec-settings-show-product-img', function () {
    var _self = jQuery(this);
    if (_self.is(':checked')) {
        jQuery('.ec-settings-product-image').show();
    } else {
        jQuery('.ec-settings-product-image').hide();
    }
});

function check_email_rtl_support() {
    if (jQuery('#ec-settings-rtl').is(":checked")) {
        jQuery('.ec-preview-content-body *').attr('dir', 'rtl');
        jQuery('.woo-items-list-5 *').removeAttr('dir');
        jQuery('.woo-items-list-5').attr('dir', 'rtl');
    } else {
        jQuery('.ec-preview-content-body *').attr('dir', 'ltr');
        jQuery('.woo-items-list-5 *').removeAttr('dir');
        jQuery('.woo-items-list-5').attr('dir', 'ltr');
    }
}

jQuery(document).on('click', '#save_general_settings', function () {
    var _self=jQuery(this);
    if (_self.attr('loading')=='yes') {
      return;
    }
    _self.attr('loading','yes');
    _self.text('Loading...');
    // if (jQuery(this).hasClass('single-request')) {
    //     return;
    // }
    var data = {
        action: 'save_settings',
        img_width: jQuery('#ec-settings-product-img-width').val(),
        img_height: jQuery('#ec-settings-product-img-height').val(),
        show_img: jQuery('#ec-settings-show-product-img').is(":checked") == true ? 1 : 0,
        show_sku: jQuery('#ec-settings-show-product-sku').is(":checked") == true ? 1 : 0,
        replace_mail: jQuery('#ec-settings-replace-mail').is(":checked") == true ? 1 : 0,
        rtl: jQuery('#ec-settings-rtl').is(":checked") == true ? 1 : 0,
        cell_padding: jQuery('#ec-settings-border-padding').val(),
        email_type: jQuery('#ec_woo_type').val(),
        show_custom_shortcode: jQuery('#ec-settings-show-custom-shortcode').is(":checked") == true ? 1 : 0,
        replace_email_type: jQuery('#ec-settings-replace-mail-for-type').is(":checked") == true ? 1 : 0,
        show_meta: jQuery('#ec-settings-show-meta').is(":checked") == true ? 1 : 0,
    };

    check_email_rtl_support();

    ajax_request(data, function (response) {
        jQuery('#ec_woo_order').change();
        iziToast.success({
            title: 'Success!',
            message: 'Settings saved',
            position: 'bottomRight'
        });
        _self.removeAttr('loading');
        _self.text('Save');
    },function () {
      _self.removeAttr('loading');
      _self.text('Save');
    });
});

jQuery(document).on('click', '#save_related_items', function () {
    var _self=jQuery(this);
    if (_self.attr('loading')=='yes') {
      return;
    }
    _self.attr('loading','yes');
    _self.text('Loading...');

    var data = {
        action: 'save_related_items',
        columns: jQuery('#ec-related-items-columns').val(),
        count: jQuery('#ec-related-items-count').val(),
        products_by: jQuery('#ec-related-items-products-by').val(),
        show_price: jQuery('#ec-related-items-show-price').is(":checked") == true ? 1 : 0,
        show_name: jQuery('#ec-related-items-show-name').is(":checked") == true ? 1 : 0,
        show_image: jQuery('#ec-related-items-show-image').is(":checked") == true ? 1 : 0
    };

    ajax_request(data, function (response) {
        jQuery('#ec_woo_order').change();
        iziToast.success({
            title: 'Success!',
            message: 'Related Items Settings saved',
            position: 'bottomRight'
        });
        _self.removeAttr('loading');
        _self.text('Save');
    },function () {
      _self.removeAttr('loading');
      _self.text('Save');
    });
});

jQuery(document).on('change', '#ec-settings-replace-mail-for-type', function () {

    var data = {
        action: 'save_settings_replace_email_type',
        email_type: jQuery('#ec_woo_type').val(),
        replace_email_type: jQuery('#ec-settings-replace-mail-for-type').is(":checked") == true ? 1 : 0
    };

    check_email_rtl_support();

    ajax_request(data, function (response) {
        jQuery('#ec_woo_order').change();
        iziToast.success({
            title: 'Success!',
            message: 'Settings saved',
            position: 'bottomRight'
        });
    });
});

jQuery(document).on('click', '#save_custom_css', function () {
    var data = {
        action: 'save_custom_css',
        custom_css: jQuery('#custom_css').val()
    };

    ajax_request(data, function (response) {
        jQuery('#page-custom-style').html(jQuery('#custom_css').val());
        iziToast.success({
            title: 'Success!',
            message: 'Custom CSS saved',
            position: 'bottomRight'
        });

    });
});


// Setup isScrolling variable
var isScrolling;

// Listen for scroll events
window.addEventListener('scroll', function (event) {

    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);

    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function () {

        // Run the callback
        //console.log('Scrolling has stopped.');
        window.scrollTo(0, 0);
    }, 66);

}, false);

jQuery(document).on('click', '.ec-control-help', function () {
    jQuery('.ec-modal-library-content').show();
    jQuery('#modal-help').fadeIn();
});

jQuery(document).on('click', '.ec-email-preview', function () {
    var _loading = jQuery('#modal-preview .ec-modal-library-preview-content-loading');
    var _iframe = jQuery('#modal-preview .ec-modal-library-preview-content-frame');
    _iframe.hide();
    _loading.show();
    var _type = jQuery('#ec_woo_type').val();
    var _id = jQuery('#ec_woo_order').val();
    var _url = woo_ec_vars.admin_url + 'admin.php?page=' + woo_ec_vars.preview + '&ecwoo_render_email=yes&ecwoo_email_type=' + _type + '&ecwoo_email_order=' + _id + '&ecwoo_in_popup=true';
    _iframe.attr('src', _url);
    _iframe.on('load', function () {
        _iframe.show();
        _loading.hide();
    });
    jQuery('#modal-preview').fadeIn();
});


jQuery(document).on('click', '#ec-activate-updates-submit', function () {
    var __self = jQuery(this);
    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var $purchase_code = jQuery('#ec-purchase-code');

    if ($purchase_code.val() == '') {
        $purchase_code.addClass('ec-modal-input-has-error');
        return false;
    }
    $purchase_code.removeClass('ec-modal-input-has-error');
    var $loading = __self.find('.ec-modal-input-submit-loading');
    var $label = __self.find('.ec-modal-input-submit-label');

    var _data = {
        action: 'activate_updates',
        purchase_code: $purchase_code.val()
    };

    $label.hide();
    $loading.show();
    __self.addClass('ec-clicked');
    jQuery('#ec-activate-updates-error').html('');
    ajax_request(_data, function () {
        iziToast.success({
            title: 'Updates activated!',
            message: '',
            position: 'bottomRight'
        });

        $label.show();
        $loading.hide();
        __self.removeClass('ec-clicked');

        jQuery('#modal-activate').fadeOut();

    }, function (response) {
        jQuery('#ec-activate-updates-error').html(response.message);
        $label.show();
        $loading.hide();
        __self.removeClass('ec-clicked');
    });
});

jQuery(document).on('click', '#ec-activate-updates-skip', function () {
    var __self = jQuery(this);
    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var _data = {
        action: 'skip_activate_updates'
    };
    ajax_request(_data, function () {
        iziToast.success({
            title: 'Activate updates skipped!',
            message: '',
            position: 'bottomRight'
        });
        __self.removeClass('ec-clicked');
        jQuery('#modal-activate').fadeOut();

    }, function () {
        __self.removeClass('ec-clicked');
    });

    return false;
});

jQuery(document).on('click', '.ec-export-all', function(e) {
  var _self = jQuery(this);
  if (_self.parents('.ec-control-export').hasClass('ec-preview-header-control-item-disable')) {
    return false;
  }

  var __data = {
    action: 'export_all'
  };

  //use loader in main page

  ajax_request(__data, function(response) {
    window.location.href = response.url;
    jQuery(document).click();
  });
});
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var templates = builder.Templates || (builder.Templates = {});

  var _templateColumn = function(label, body, settings_type, id) {
    var item = (
      '<div class="ec-preview-content-sortable-column" data-settings="yes" data-settings-type="'+settings_type+'" data-id="'+id+'" >' +
      '  <div class="ec-preview-content-sortable-column-container">' +
      '    <div class="ec-preview-content-sortable-column-help-text">' +
      '      '+label+'' +
      '    </div>' +
      '    <div class="ec-preview-content-sortable-column-control-list">' +

      '      <div class="ec-preview-content-sortable-column-control-item" data-type="duplicate">' +
      '        <i class="ec-duplicate"></i>' +
      '      </div>' +
      '      <div class="ec-preview-content-sortable-column-control-item" data-type="delete">' +
      '        <i class="ec-delete"></i>' +
      '      </div>' +
      '      <div class="ec-preview-content-sortable-column-control-item" data-type="move">' +
      '        <i class="ec-drag"></i>' +
      '      </div>' +
      '    </div>' +
      '    <div class="ec-preview-content-sortable-column-body">' +
      '      '+body+'' +
      '    </div>' +
      '  </div>' +
      '</div>');

    return item;
  }


  var _templateStructure = function(label, body, id, width) {
    var item = (
      '<div class="ec-preview-content-sortable-row" data-id="'+id+'" data-settings="yes" data-settings-type="row">' +
      ' <div class="ec-preview-content-sortable-row-container">' +
      '  <div class="ec-preview-content-sortable-row-help-text">' +
      label +
      '  </div>' +
      '  <div class="ec-preview-content-sortable-row-control-list">' +

      '    <div class="ec-preview-content-sortable-row-control-item" data-type="duplicate">' +
      '      <i class="ec-duplicate"></i>' +
      '    </div>' +
      '    <div class="ec-preview-content-sortable-row-control-item" data-type="delete">' +
      '      <i class="ec-delete"></i>' +
      '    </div>' +
      '    <div class="ec-preview-content-sortable-row-control-item" data-type="move">' +
      '      <i class="ec-drag"></i>' +
      '    </div>' +
      '  </div>' +
      '  <div class="ec-preview-content-sortable-row-body" style="width:'+width+'}">' +
      body+
      '  </div>' +
      ' </div>' +
      '</div>');

    return item;
  }

  var _templateElement = function(id, name, icon, preview, type) {
    var item = ('<li data-id="'+id+'" >' +
      '<div class="ec-panel-elements-list-item">' +
      '<div class="ec-panel-elements-list-item-preview">' +
      '<div class="ec-panel-elements-list-item-icon">' +
      '<i class="'+icon+'"></i>' +
      '</div>' +
      '<div class="ec-panel-elements-list-item-name">' +
      name +
      '</div>' +
      '</div>' +
      '<div class="ec-panel-elements-list-item-view" data-url="'+preview+'" data-type="'+type+'" data-id="'+id+'"> ' +

      '</div>' +
      '</div>' +
      '</li>');

    return item;
  }

  var _templateElementItem = function(id, name, content) {
    var item = ('<div class="ec-panel-accordion-item" data-id="'+id+'">' +
      '<div class="ec-panel-accordion-title ec-clear">' +
      name +
      '<div class="ec-panel-accordion-title-icon">' +
      '<i class="ec-caret-down"></i>' +
      '</div>' +
      '</div>' +
      '<div class="ec-panel-accordion-content">' +
      '<ul class="ec-panel-elements-list ec-clear">' +
      content +
      '</ul>' +
      '</div>' +
      '</div>');

    return item;
  };

  var _templateBlock = function(id, imageSrc, name, insertText) {
    var item =('<div class="ec-modal-library-element-item" data-id="'+id+'">' +
      '<div class="ec-modal-library-element-item-image-container">' +
      '<div class="ec-modal-library-element-item-image" >' +
      '<img src="'+imageSrc+'"/></div>' +
      '<div class="ec-modal-library-element-item-image-preview">' +
      '<span>' +
      '<i class="ec-detail"></i>' +
      '</span>' +
      '</div>' +
      '</div>' +
      '<div class="ec-modal-library-element-item-name-container">' +
      '<div class="ec-modal-library-element-item-name">' +
      '<span>'+name+'</span>' +
      '</div>' +
      '<div class="ec-modal-library-element-item-name-hover" data-action="load-template" data-id="'+id+'" data-type="blocks">' +
      '<i class="ec-download"></i>' +
      '<span>'+insertText+'</span>' +
      '</div>' +
      '</div>' +
      '</div>');

    return item;
  };

  var _templateBlockNodata = function(message) {
    var item = ('<div class=" ec-modal-library-grid-no-data">'+message+'</div>');

    return item;
  };

  var _templateBlockCategory = function functionName(id, name) {
    var item = ('<option value="'+id+'">'+name+'</option>');

    return item;
  };

  var _template = function functionName(id, imageSrc, name, insertText) {
    var item = ('<div class="ec-modal-library-element-item" data-id="'+id+'">' +
      '<div class="ec-modal-library-element-item-image-container">' +
      '<div class="ec-modal-library-element-item-image" style="background-image:url('+imageSrc+');height: 17.5em;">' +
      '</div>' +
      '<div class="ec-modal-library-element-item-image-preview">' +
      '<span>' +
      '<i class="ec-detail"></i>' +
      '</span>' +
      '</div>' +
      '</div>' +
      '<div class="ec-modal-library-element-item-name-container">' +
      '<div class="ec-modal-library-element-item-name">' +
      '<span>'+name+'</span>' +
      '</div>' +
      '<div class="ec-modal-library-element-item-name-hover" data-action="load-template" data-id="'+id+'" data-type="templates">' +
      '<i class="ec-download"></i>' +
      '<span>'+insertText+'</span>' +
      '</div>' +
      '</div>' +
      '</div>');

    return item;
  }

  var _templateNodata = function(message) {
    var item = ('<div class=" ec-modal-library-grid-no-data">'+message+'</div>');

    return item;
  }

  var _templateCategory = function functionName(id, name) {
    var item = ('<option value="'+id+'">'+name+'</option>');

    return item;
  }

  var _templateSaved = function functionName(id, date, name, insertText, previewText, deleteText, plugin_url) {
    var item = ('<div class="ec-modal-library-grid-row" data-id="'+id+'">' +
      '<div class="ec-modal-library-grid-column ec-modal-library-grid-column-1">' +
      '<span>'+name+' </span>' +
      '</div>' +
      '<div class="ec-modal-library-grid-column ec-modal-library-grid-column-2">' +
      '<span>'+date+'</span>' +
      '</div>' +
      '<div class="ec-modal-library-grid-column ec-modal-library-grid-column-3">' +
      '<div class="ec-modal-library-grid-action-list">' +

      '<div class="ec-modal-library-grid-action-item ec-modal-library-grid-action-insert">' +
      '<i class="ec-download"></i>' +
      '<span>'+insertText+'</span>' +
      '</div>' +
      '<div class="ec-modal-library-grid-action-item ec-modal-library-grid-action-delete">' +
      '<i class="ec-delete"></i>' +
      '<span>'+deleteText+'</span>' +
      '</div>' +
      '</div>' +
      '<div class="ec-modal-library-grid-action-item ec-modal-library-grid-action-loading">' +
      '<img src="'+plugin_url+'/assets/img/loading.gif" alt="loading" />' +
      '</div>' +
      '</div>' +
      '</div>');

    return item;
  }

  var _templateSavedNodata = function(message) {
    var item = ('<div class=" ec-modal-library-grid-no-data">'+message+'</div>');

    return item;
  }

  var _templateSavedHeader = function(name, date, actions) {
    var item = ('<div class="ec-modal-library-grid-row ec-modal-library-grid-row-header">' +
      '<div class="ec-modal-library-grid-column ec-modal-library-grid-column-1">' +
      '<span>'+name+'</span>' +
      '</div>' +
      '<div class="ec-modal-library-grid-column ec-modal-library-grid-column-2">' +
      '<span>'+date+'</span>' +
      '</div>' +
      '<div class="ec-modal-library-grid-column ec-modal-library-grid-column-3">' +
      '<span>'+actions+'</span>' +
      '</div>' +
      '</div>');

    return item;
  }


  var _template_export_row = function(bg, body, width,direction) {
    var item = ('<table  dir="'+direction+'" bg-color="'+bg+'" cellspacing="0"  cellpadding="0" border="0" width="100%" style="width:100%;background-color:'+bg+' ">'+
                  '<tr dir="'+direction+'">'+
                    '<td valign="top" dir="'+direction+'">'+
                      '<table dir="'+direction+'" role="presentation" cellspacing="0" align="center" cellpadding="0" border="0" width="100%" bg-color="'+bg+'" style="background-color:'+bg+'">' +
                          '<tr  dir="'+direction+'" align="center">' +
                          '  <td valign="top"  align="center" dir="'+direction+'">' +
                          '    <div align="center" dir="'+direction+'" style="max-width: '+width+'; margin: -5px auto;" class="email-container">' +
                          '     <!--[if mso | IE]>  <table role="presentation" cellspacing="0" align="center" cellpadding="0" border="0" width="'+width+'" bg-color="'+bg+'" style="background-color:'+bg+' !important"><tr>  <td><![endif]-->'+
                          '     '+body+' ' +
                          '     <!--[if mso | IE]></td></tr></table><![endif]-->'+
                          '    </div>' +
                          '  </td>' +
                          '</tr>' +
                          '</table>'+
                        '</td>' +
                      '</tr>' +
                  '</table>');

    return item;
  }

  var _template_shortcode_item = function(id, name, desc) {
    var item = ('<div class="ec-modal-library-grid-row ec-modal-library-grid-row-header no-margin" data-id="'+id+'">' +
      '  <div class="ec-modal-library-grid-column ec-modal-library-grid-column-4">' +
      '    <span>['+name+']</span>' +
      '  </div>' +
      '  <div class="ec-modal-library-grid-column ec-modal-library-grid-column-8">' +
      '    <span>'+desc+'</span>' +
      '  </div>' +
      '</div>');

    return item;
  }
  var _template_shortcode = function(id, name, item_list) {
    var item ='<div class="ec-modal-library-grid-item" data-id="'+id+'">' +
      '    <div class="ec-modal-library-grid-row">' +
      '        <div class="ec-modal-library-grid-column ec-modal-library-grid-column-1">' +
      '          <span>'+name+'</span>' +
      '        </div>' +
      '        <div class="ec-modal-library-grid-column ec-modal-library-grid-column-icon">' +
      '          <i class="ec-caret-down"></i>' +
      '        </div>' +
      '    </div>' +
      '    <div class="ec-modal-library-grid-item-list">' +
      item_list +
      '    </div>' +
      '  </div>';

    return item;
  }

  var _template_shortcode_no_data = function(message) {


    var item ='<div class=" ec-modal-library-grid-no-data ec-modal-library-margin-top ">'+message+'</div>';
    return item;
  };

  var _loadTemplates = function() {

    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
    };

    templates.structure = _templateStructure;
    templates.element = _templateElement;
    templates.element_item = _templateElementItem;
    templates.block = _templateBlock;
    templates.block_no_data = _templateBlockNodata;
    templates.block_category = _templateBlockCategory;

    templates.template = _template;
    templates.template_no_data = _templateNodata;
    templates.template_category = _templateCategory;

    templates.template_saved = _templateSaved;
    templates.template_saved_no_data = _templateSavedNodata;
    templates.template_saved_header = _templateSavedHeader;

    templates.column = _templateColumn;
    templates.export_row = _template_export_row;

    templates.shortcode_item = _template_shortcode_item;
    templates.shortcode = _template_shortcode;
    templates.shortcode_no_data = _template_shortcode_no_data;

  };



  _loadTemplates();
}(this));
(function(global) {
  "use strict";
  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});

  var _loadJson = function(jsonURl, callBack) {
    jQuery.getJSON(jsonURl, function(response) {
      callBack(response);
    });
  }
  var _loadFile = function(fileURl, callBack) {
    jQuery.get(fileURl, function(response) {
      callBack(response);
    });
  }

  //it works only debug mode
  var _writeMessage = function(filename, function_name, msg) {
    if (settings.debug_mode == true) {
      console.log('------BEGIN-------');
      console.log('Filename : ' + filename);
      console.log('Function name : ' + function_name);
      console.log('Message :');
      console.log(msg);
      console.log('-------END------');
      console.log(' ');
    }
  };
  var _rgb2hex = function(rgb) {
    if (rgb === undefined) {
      return '';
    }
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
  }
  var _getURI = function() {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
  };

  var _ajaxGET = function(_url) {
    return jQuery.ajax({
      url: _url,
      dataType: 'json',
      type: 'GET'
    });
  }
  var _ajaxGetFile = function(_url) {
    return jQuery.ajax({
      url: _url,
      type: 'GET'
    });
  }

  utils.loadJson = _loadJson;
  utils.loadFile = _loadFile;
  utils.writeMessage = _writeMessage;
  utils.getURI = _getURI;
  utils.ajaxGET = _ajaxGET;
  utils.ajaxGetFile = _ajaxGetFile;
  utils.rgb2hex = _rgb2hex;

  utils.loadFuntions = [];

}(this));
(function(global) {

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});

  var _web_url = woo_ec_vars.plugin_url;
  var _web_version = woo_ec_vars.version;
  var _dir_lang = _web_url + '/settings/languages.json?v=' + _web_version;
  var _dir_templates = _web_url + '/settings/templates.json?v=' + _web_version;
  var _dir_templates_saved = _web_url + '/settings/templates-saved.json?v=' + _web_version;
  var _dir_blocks = _web_url + '/settings/blocks.json?v=' + _web_version;
  var _dir_tinymce_tags = _web_url + '/settings/tinymce_tags.json?v=' + _web_version;
  var _dir_elements = _web_url + '/settings/elements.json?v=' + _web_version;
  var _dir_structure = _web_url + '/settings/structure.json?v=' + _web_version;
  var _dir_template_export = _web_url + '/settings/template.html?v=' + _web_version;
  var _dir_shortcode = _web_url + '/settings/shortcodes.json?v=' + _web_version;

  settings.debug_mode = false;

  var _loadLanguages = function() {
    return utils.ajaxGET(_dir_lang);
  }

  var _loadTemplates = function() {
    return utils.ajaxGET(_dir_templates);
  }

  var _loadTags = function() {
    return utils.ajaxGET(_dir_tinymce_tags);
  }

  var _loadBlocks = function() {
    return utils.ajaxGET(_dir_blocks);
  }

  var _loadElements = function() {
    return utils.ajaxGET(_dir_elements);
  }
  var _loadStructure = function() {
    return utils.ajaxGET(_dir_structure);
  }
  var _loadTemplateExport = function() {
    return utils.ajaxGetFile(_dir_template_export);
  }
  var _loadShortCode = function() {
    return utils.ajaxGetFile(_dir_shortcode);
  }

  var _loadSettings = function(callback_success, callback_error) {

    jQuery.when(_loadLanguages(), _loadTemplates(), _loadTags(), _loadBlocks(), _loadElements(), _loadStructure(), _loadTemplateExport(), _loadShortCode())
      .then(function(response_lang, response_templates, response_tags, response_blocks, response_elements, response_structure, response_template_export, response_shortcodes) {

        settings.templates = response_templates[0];
        settings.languages = response_lang[0];
        settings.tinymce_tags = response_tags[0];
        settings.blocks = response_blocks[0];
        settings.elements = response_elements[0];
        settings.structure = response_structure[0];
        settings.template_export = response_template_export[0];
        settings.shortcodes = response_shortcodes[0];




        callback_success();


      }, function(jqXHR, textStatus, errorThrown) {
        callback_error(jqXHR, textStatus, errorThrown);
      });
  }
  //_loadSettings();
  settings.load = _loadSettings;

  settings.dir_saved_templates = _dir_templates_saved;

}(this));
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});
  var templates = builder.Templates || (builder.Templates = {});

  var _template = function(id, name, icon, preview, type) {
    return templates.element(id, name, icon, preview, type);
  }
  var _templateItem = function(id, name, content) {
    return templates.element_item(id, name, content);
  }
  var _getList = function() {
    return settings.elements.list;
  }
  var _getCategoryList = function() {
    return settings.elements.category;
  }

  var _generateContentList = function(categoryId, _elements_list) {
    var _list = _getItemByCategoryId(categoryId, _elements_list);
    var _temp_list = '';

    for (var i = 0; i < _list.length; i++) {
      _temp_list += _template(_list[i].id, _list[i].name, _list[i].icon, _list[i].preview, _list[i].type);
    }
    return _temp_list;
  }

  var _generateCategoryList = function(_elements_list) {
    var _catList = _getCategoryList();


    var _temp_list = '';

    for (var i = 0; i < _catList.length; i++) {
      var _list = _generateContentList(_catList[i].id, _elements_list);
      if (_list.length == 0) {
        continue;
      }
      _temp_list += _templateItem(_catList[i].id, _catList[i].name, _list);
    }
    return _temp_list;
  }

  var _getItemByCategoryId = function(_id, _elements_list) {
    var _list = _.where(_elements_list, {
      category: _id
    });

    return _sort_list(_list);

  }
  var _sort_list = function(_elements_list) {
    return _.sortBy(_elements_list, function(item) {
      return item.order;
    });
  }
  var _getSearch = function(_name) {
    utils.writeMessage('_helperElements.js', '_getSearch', ' name: ' + _name);
    var _list = _getList();
    var r_list = _.filter(_list, function(item) {
      return item.name.toLowerCase().indexOf(_name.toLowerCase()) != -1;
    });

    return _sort_list(r_list);
  }
  var _getSearchType = function(type) {
    utils.writeMessage('_helperElements.js', '_getSearchType', ' name: ' + type);
    var _list = _getList();
    var r_list = _.filter(_list, function(item) {
      return item.type == type;
    });

    return _sort_list(r_list);
  }

  var _getSearchId = function(id) {
    utils.writeMessage('_helperElements.js', '_getSearchId', ' name: ' + id);
    var _list = _getList();
    var r_list = _.filter(_list, function(item) {
      return item.id == id;
    });

    return _sort_list(r_list);
  }

  var _load_helper_element = function() {
    utils.elements = utils.elements || (utils.elements = {});
    utils.elements.generate = _generateCategoryList;
    utils.elements.search = _getSearch;
    utils.elements.search_type = _getSearchType;
    utils.elements.search_id = _getSearchId;

    utils.elements.list = _getList();
  };

  utils.loadFuntions.push(_load_helper_element);

}(this));
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});
  var templates = builder.Templates || (builder.Templates = {});

  var _template = function(id, name, item_list) {
    return templates.shortcode(id, name, item_list);
  }
  var _template_no_data = function(msg) {
    return templates.shortcode_no_data(msg);
  }
  var _templateItem = function(id, name, desc) {
    return templates.shortcode_item(id, name, desc);
  }
  var _getList = function() {
    return settings.shortcodes.list;
  }
  var _getCategoryList = function() {
    return settings.shortcodes.category;
  }

  var _generateContentList = function(categoryId, _elements_list) {
    var _list = _getItemByCategoryId(categoryId, _elements_list);
    var _temp_list = '';

    for (var i = 0; i < _list.length; i++) {
      _temp_list += _templateItem(_list[i].id, _list[i].name, _list[i].desc);
    }
    return _temp_list;
  }

  var _generateCategoryList = function(_elements_list) {
    var _catList = _getCategoryList();
    var __msg = settings.languages.modal_library_no_data;
    if (_elements_list == undefined) {
      _temp_list = _template_no_data(__msg);
      return _temp_list;
    } else if (_elements_list.length == 0) {
      _temp_list = _template_no_data(__msg);
      return _temp_list;
    }

    var _temp_list = '';

    for (var i = 0; i < _catList.length; i++) {
      var _list = _generateContentList(_catList[i].id, _elements_list);
      if (_list.length == 0) {
        continue;
      }
      _temp_list += _template(_catList[i].id, _catList[i].name, _list);
    }
    return _temp_list;
  }

  var _getItemByCategoryId = function(_id, _elements_list) {
    var _list = _.where(_elements_list, {
      category: _id
    });

    return _sort_list(_list);

  }
  var _sort_list = function(_elements_list) {
    return _.sortBy(_elements_list, function(item) {
      return item.order;
    });
  }
  var _getSearch = function(_name) {
    var _list = _getList();
    var r_list = _.filter(_list, function(item) {
      return item.name.toLowerCase().indexOf(_name.toLowerCase()) != -1 || item.desc.toLowerCase().indexOf(_name.toLowerCase()) != -1;
    });

    return _sort_list(r_list);
  }
  var _getSearchType = function(type) {
    var _list = _getList();
    var r_list = _.filter(_list, function(item) {
      return item.type == type;
    });

    return _sort_list(r_list);
  }

  var _getSearchId = function(id) {
    var _list = _getList();
    var r_list = _.filter(_list, function(item) {
      return item.id == id;
    });

    return _sort_list(r_list);
  }

  var _load_helper_element = function() {
    utils.shortcodes = utils.shortcodes || (utils.shortcodes = {});
    utils.shortcodes.generate = _generateCategoryList;
    utils.shortcodes.search = _getSearch;
    utils.shortcodes.search_type = _getSearchType;
    utils.shortcodes.search_id = _getSearchId;

    utils.shortcodes.list = _getList();
  };

  utils.loadFuntions.push(_load_helper_element);

}(this));
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});
  var templates = builder.Templates || (builder.Templates = {});



  var _getList = function() {
    return settings.structure.list;
  }

  var _template = function(label, body, id, width) {
    return templates.structure(label, body, id, width);
  }



  var _getItemById = function(_id) {
    return _.where(_getList(), {
      id: _id
    });
  }


  var _load_helper_structure = function() {
    utils.structure = utils.structure || (utils.structure = {});
    utils.structure.list = _getList();
    utils.structure.where = _getItemById;
    utils.structure.get_template = _template;
  };

  utils.loadFuntions.push(_load_helper_structure);

}(this));

(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});
  var templates = builder.Templates || (builder.Templates = {});

  var _preview_content = '.ec-preview-content';

  var _structure_sortable = '.ec-preview-content-sortable';
  var _structure_item = '.ec-structure-element-item';
  var _structure_item_preview = '.ec-structure-element-preview';
  var _structure_item_view = '.ec-structure-element-view';
  var _structure_item_empty_column = '.ec-preview-content-sortable-column-empty';


  var _column_sortable = '.ec-preview-content-sortable-column-wrapper';
  var _column_item = '.ec-panel-elements-list-item';

  var _column_item_preview = '.ec-panel-elements-list-item-preview';
  var _column_item_view = '.ec-panel-elements-list-item-view';

  var _sortable_column_container = '.ec-preview-content-sortable-column-wrapper';
  var _sortable_column = '.ec-preview-content-sortable-column';
  var _sortable_column_move = '.ec-preview-content-sortable-column-control-item[data-type="move"]';
  var _sortable_column_duplicate = '.ec-preview-content-sortable-column-control-item[data-type="duplicate"]';
  var _sortable_column_delete = '.ec-preview-content-sortable-column-control-item[data-type="delete"]';

  var _sortable_row_container = '.ec-preview-content-sortable';
  var _sortable_row = '.ec-preview-content-sortable-row';
  var _sortable_row_move = '.ec-preview-content-sortable-row-control-item[data-type="move"]';
  var _sortable_row_duplicate = '.ec-preview-content-sortable-row-control-item[data-type="duplicate"]';
  var _sortable_row_delete = '.ec-preview-content-sortable-row-control-item[data-type="delete"]';

  var label_column;
  var _row_template;
  var label_structure;
  var label_column_empty;

  var label_modal_remove_title;
  var label_modal_remove_text;
  var label_modal_remove_confirm_text;
  var label_modal_remove_cancel_text;

  var _row_default_content;

  var __helper_export_button = function() {
    var __canvas_element_count = jQuery('.ec-preview .main-column').length;
    var __class_disable = 'ec-preview-header-control-item-disable';
    var __btn_export = '.ec-control-export';
    var __btn_save_sub = '.ec-control-save-sub';
    var __btn_preview = '.ec-email-preview';

    if (__canvas_element_count == 0) {
      jQuery(__btn_export).addClass(__class_disable);
      jQuery(__btn_save_sub).addClass(__class_disable);
      jQuery(__btn_preview).addClass(__class_disable);
    } else {
      jQuery(__btn_export).removeClass(__class_disable);
      jQuery(__btn_save_sub).removeClass(__class_disable);
      jQuery(__btn_preview).removeClass(__class_disable);

    }

    var __emailTypeSelected=jQuery('#ec_woo_type').val();
    if (__canvas_element_count > 0 && __emailTypeSelected!="") {
      jQuery('.ec-control-save').removeClass('ec-control-save-disabled');
    }else {
      jQuery('.ec-control-save').addClass('ec-control-save-disabled');
    }

  }



  var _element_duplicate = function(_self, _sortable_element) {

    var _row = _self.parents(_sortable_element);
    if (_row.parent().hasClass('ui-draggable')) {
      _row = _row.parent();
      _row.addClass('active');
      var _clone = _row.clone();
      _clone.removeClass('hover active').find(_sortable_element).removeClass('hover active');
      _clone.insertAfter('.ui-draggable.active');
      _row.removeClass('active');
    } else {
      _row.addClass('active');
      _row.clone().removeClass('hover active').insertAfter(_sortable_element + '.active');
      _row.removeClass('active');
    }


    setTimeout(function() {
      _columnSortable();
    }, 1000);
  }

  var _swal_remove_modal = function(callback) {

    jQuery('#modal-confirm').fadeIn();

    jQuery('#modal-confirm-ok').on('click', function() {
      callback();
      jQuery('#modal-confirm').fadeOut();
    });

    jQuery('#modal-confirm-cancel').on('click', function() {
      jQuery('#modal-confirm').fadeOut();
    });

  };

  var _get_row_count = function() {
    return jQuery(_sortable_row_container + ' ' + _sortable_row).length;
  }

  var _hide_empty_column = function() {

    jQuery(_column_sortable).each(function() {
      var _self = jQuery(this);
      var x = _self.children().length;
      if (x > 1) {
        _self.find(_structure_item_empty_column).hide();
      } else {
        _self.find(_structure_item_empty_column).show();
      }
    });
  }

  var _rowSortable = function() {
    jQuery(_sortable_row_container).sortable({
      placeholder: "ec-row-placeholder",
      forcePlaceholderSize: true,
      handle: _sortable_row_move,
      revert: false,
      axis: 'y'
    });
  }

  var _load_column_empty_label = function() {
    jQuery(_structure_item_empty_column).attr('data-label', label_column_empty);
  }

  var _rowDraggable = function() {
    jQuery(_structure_item).draggable({
      connectToSortable: _structure_sortable,
      helper: "clone",
      revert: false,
      create: function(event, ui) {

      },
      drag: function(event, ui) {
        _load_column_empty_label();
      },
      start: function(event, ui) {
        ui.helper.find(_structure_item_preview).hide();
        ui.helper.find(_structure_item_view).show();
      },
      stop: function(event, ui) {
        var _content_bg_color = jQuery('.ec-preview').attr('data-content-bg-color');
        var __element_id = ui.helper.attr('data-id');
        var __email_width = __get_email_width();
        ui.helper.html(_row_template(label_structure, ui.helper.find(_structure_item_view).html(), __element_id, __get_email_width()));
        ui.helper.find('.ec-preview-content-sortable-row-body').css('background-color', _content_bg_color);
        ui.helper.find('.ec-preview-content-sortable-row-body').css('width', __email_width);
        ui.helper.find('.main-row').attr('width', __email_width);
        jQuery(_structure_sortable).find(_structure_item).attr('style', '');;

        _columnDraggable();
        _columnSortable();
        jQuery(_structure_sortable).find(_structure_item).removeClass(_structure_item.replace('.', ''));

      }
    });
  }

  var _columnSortable = function() {
    jQuery(_sortable_column_container).sortable({
      placeholder: "ec-row-placeholder",
      connectWith: _sortable_column_container,
      forcePlaceholderSize: true,
      handle: _sortable_column_move,
      revert: false,
      update: function() {
        _hide_empty_column();
      }
    });
  }

  var _columnDraggable = function() {

    jQuery(_column_item).draggable({
      connectToSortable: _column_sortable,
      helper: "clone",
      revert: false,
      create: function(event, ui) {

      },
      drag: function(event, ui) {
        ui.helper.css('z-index', '11111');
      },
      start: function(event, ui) {
        ui.helper.find(_column_item_preview).show();
        ui.helper.find(_column_item_view).hide();

        jQuery(_preview_content).attr('data-draggable', 'yes');
      },
      stop: function(event, ui) {

        var _view = ui.helper.find(_column_item_view);
        var __element_id = _view.attr('data-id');
        var __column_element = utils.elements.search_id(parseInt(__element_id))[0];

        ui.helper.html(templates.column(__column_element.name, _view.html(), _view.attr('data-type'), __element_id));


        ui.helper.find(_column_item_preview).hide();
        ui.helper.find(_column_item_view).show();

        jQuery(_column_sortable).find(_column_item).attr('style', '');
        jQuery(_column_sortable).find(_column_item).removeClass(_column_item.replace('.', ''));
        jQuery(_preview_content).removeAttr('data-draggable');
        _hide_empty_column();
        __helper_export_button();
      }
    });
  }

  var _load_default_row = function() {
    var _web_url = woo_ec_vars.plugin_url;
    var __id = 1;
    if (_row_default_content === undefined) {
      var structure_element = utils.structure.where(__id)[0];
      (function(_structure_sortable, url) {
        utils.loadFile(url, function(response) {
          _row_default_content = response;
          jQuery(_structure_sortable).html(_row_template(label_structure, _row_default_content, __id, __get_email_width()));
          _load_column_empty_label();
        });
      }(_structure_sortable, _web_url + structure_element.url));
    } else {
      jQuery(_structure_sortable).html(_row_template(label_structure, _row_default_content, __id, __get_email_width()));
      _load_column_empty_label();
    }
    jQuery('.ec-panel-header-icon').click();
    _columnDraggable();
    _columnSortable();
  }

  var _load_settings = function() {
    _row_template = utils.structure.get_template;
    label_structure = settings.languages.structure_label;
    label_column_empty = settings.languages.column_empty_label;
    label_column = settings.languages.column_label;

    label_modal_remove_title = settings.languages.modal_remove_title;
    label_modal_remove_text = settings.languages.modal_remove_text;
    label_modal_remove_confirm_text = settings.languages.modal_remove_confirm_text;
    label_modal_remove_cancel_text = settings.languages.modal_remove_cancel_text;

  }
  var __get_email_width = function() {
    return jQuery('#settings-email-width').val() + 'px';
  }
  var _draggable = function() {

    _load_settings();

    _load_default_row();

    _rowDraggable();
    _rowSortable();

    setTimeout(function() {
      _columnDraggable();
      _columnSortable();

    }, 100);



  };


  utils.loadFuntions.push(_draggable);
  utils.helper_export_button = __helper_export_button;


  jQuery(document).on('click', _sortable_row_delete, function() {
    var _self = jQuery(this);
    _swal_remove_modal(function() {
      var row = _self.parents(_sortable_row);
      if (row.parent().hasClass('ui-draggable')) {
        row.parent().remove();
      } else {
        row.remove();
      }
      if (_get_row_count() == 0) {
        _load_default_row();
      }
      __helper_export_button();
      jQuery('.ec-panel-header-icon').click();
    });
  });

  jQuery(document).on('click', _sortable_column_delete, function() {
    var _self = jQuery(this);
    _swal_remove_modal(function() {
      var container = _self.parents(_sortable_column_container);
      var column = _self.parents(_sortable_column);

      if (column.parent().hasClass('ui-draggable')) {
        column.parent().remove();
      } else {
        column.remove();
      }

      var l = container.find(_sortable_column + ':not(' + _structure_item_empty_column + ')').length;

      if (l == 0) {
        container.find(_structure_item_empty_column).show();
      }
      __helper_export_button();
      jQuery('.ec-panel-header-icon').click();
    });
  });

  jQuery(document).on('click', _sortable_row_duplicate, function() {
    _element_duplicate(jQuery(this), _sortable_row);
  });

  jQuery(document).on('click', _sortable_column_duplicate, function() {
    _element_duplicate(jQuery(this), _sortable_column);
  });

  utils.load_default_row = _load_default_row;
  utils.remove_modal = _swal_remove_modal;
  utils.load_column_empty_label = _load_column_empty_label;

  utils.draggable_row = _rowDraggable;
  utils.sortable_row = _rowSortable;
  utils.draggable_column = _columnDraggable;
  utils.sortable_column = _columnSortable;
  utils.hide_empty_column = _hide_empty_column;




}(this));
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});


  var pnlAccordion = '.ec-tab-elements .ec-panel-accordion';
  var txt_search = '.ec-tab-elements .ec-panel-tab-content-search input';
  var pnlAccordionItem = '.ec-tab-elements .ec-panel-elements-list-item';
  var pnlAccordionItemView = '.ec-panel-elements-list-item-view';

  var _filename = 'elements.js';

  var _searchElements = function() {
    var name = jQuery(txt_search).val();
    var result = utils.elements.search(name);
    jQuery(pnlAccordion).html(utils.elements.generate(result));
    _loadElementContent();
    utils.draggable_column();
    utils.sortable_column();
  }

  //mytempates search
  jQuery(document).on('keyup', txt_search, function(e) {
    _searchElements();
  });
  var __set_content = function(id, content) {
    var __list = settings.elements.list;
    for (var i = 0; i < __list.length; i++) {
      if (__list[i].id == id) {
        __list[i].content = content;
      }
    }
  }
  var _loadElementContent = function() {
    jQuery(pnlAccordionItem).each(function(index) {
      var _element = jQuery(this).find(pnlAccordionItemView);
      var _id = jQuery(this).parent().attr('data-id');
      (function(_element, _id) {
        var _web_url = woo_ec_vars.plugin_url;
        var _web_version = woo_ec_vars.version;
        utils.loadFile(_web_url + _element.attr('data-url') + '?v=' + _web_version, function(responseText) {

          responseText=responseText.split('[plugin-url]').join(_web_url);
          responseText=responseText.split('[site-url]').join(_web_url);

          __set_content(_id, responseText);
          _element.html(responseText);
        });
      }(_element, _id));
    });
  }

  //load
  var _load_elements = function() {

    jQuery(pnlAccordion).html(utils.elements.generate(utils.elements.list));
    _loadElementContent();
  };

  utils.loadFuntions.push(_load_elements);

}(this));
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});


  var _shortcode_container = '.ec-modal-library-grid.ec-shortcode-list';
  var _shortcode_search = '#library_shortcode_txt';



  var _search_shortcode = function() {
    var name = jQuery(_shortcode_search).val();
    var result = utils.shortcodes.search(name);

    jQuery(_shortcode_container).html(utils.shortcodes.generate(result));
  }

  //mytempates search
  jQuery(document).on('keyup', _shortcode_search, function(e) {
    _search_shortcode();
  });



  //load
  var _load_elements = function() {
    jQuery(_shortcode_container).html(utils.shortcodes.generate(utils.shortcodes.list));
  };

  utils.loadFuntions.push(_load_elements);

}(this));
(function(global) {
  "use strict";
  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});


  var switcher = '.ec-panel-switcher';
  var wrapper = '.ec-wrapper';
  var leftMenu = '.ec-panel';
  var content = '.ec-preview';
  var collapsedClass = 'ec-panel-collapsed';
  var contentHeader = '.ec-preview-header.active';
  var panelRight = 'ec-panel-right';

  var _clickEvent = function(_self) {
    var _parentItem = _self.parents(wrapper);

    var __left_closed = '-152px';
    var __left_default = '159px';

    if (jQuery('body').hasClass('folded')) {
      __left_closed = '-276px';
      __left_default = '36px';
    }

    if (_parentItem.hasClass(collapsedClass)) {
      _parentItem.find(leftMenu).animate({
        'left': __left_default
      }, 600, function() {
        _parentItem.find(leftMenu).attr('style', '')
      });
      _parentItem.find(content).animate({
          'margin-left': '312px',
          'width': 'calc(100% - 312px)'
      }, 600, function() {
        _parentItem.find(content).css('width', '')
      });
      _parentItem.find('.ec-builder-header').animate({
        'margin-left': '312px'
      }, 600, function() {
        _parentItem.find('.ec-builder-header').css('width', 'calc(100% - 312px)');
        //$('.ec-preview-content').css('margin-top',$('.ec-builder-header').css('height'))
        window.scrollTo(0, 0);
      });
      jQuery('.ec-panel-switcher').animate({
          'left': '26em'
      }, 600,function () {
        jQuery('.ec-panel-switcher').attr('style', '')
      });
      _parentItem.removeClass(collapsedClass);
    } else {
      _parentItem.find(leftMenu).animate({
        'left': __left_closed
      }, 600);
      _parentItem.find(content).animate({
        'margin-left': '0',
         'width': '100%'
      }, 600);
      _parentItem.find('.ec-builder-header').animate({
        'margin-left': '0',
        'width': '100%'
      }, 600);
      jQuery('.ec-panel-switcher').animate({
          'left': '0'
      }, 600);

      _parentItem.addClass(collapsedClass);
    }
  }
  var _clickRightEvent = function(_self) {
    var _parentItem = _self.parents(wrapper);
    if (_parentItem.hasClass(collapsedClass)) {
      _parentItem.find(leftMenu).animate({
        'right': '0'
      }, 600);
      _parentItem.find(content).animate({
        'right': '26em',
        'width': 'calc(100% - 26em)'
      }, 600, function() {
        _parentItem.find(content).css('width', '')
      });
      // _parentItem.find(contentHeader).animate({
      //   right: '26em',
      //   width: 'calc(100% - 26em)'
      // }, 600, function() {
      //   _parentItem.find(contentHeader).attr('style', '')
      // });
      _parentItem.find('.ec-builder-header').animate({
        'margin-right': '312px',
        'width': 'calc( 100% - 312px )'
      }, 600, function() {
        _parentItem.find('.ec-builder-header').css('width', 'calc(100% - 312px)');
        jQuery('.ec-preview-content').css('margin-top',jQuery('.ec-builder-header').css('height'))
        window.scrollTo(0, 0);
      });
      jQuery('.ec-panel-switcher').animate({
          'right': '26em'
      }, 600,function () {
        jQuery('.ec-panel-switcher').attr('style', '')
      });
      _parentItem.removeClass(collapsedClass);
    } else {
      _parentItem.find(leftMenu).animate({
        'right': '-26em'
      }, 600);
      _parentItem.find(content).animate({
        'right': '0',
        'width': '100%'
      }, 600);
      // _parentItem.find(contentHeader).animate({
      //   right: '0',
      //   width: '100%'
      // }, 600);
      jQuery('.ec-builder-header').animate({
        'margin-right': '0',
        'width': '100%'
      }, 600);

      jQuery('.ec-panel-switcher').animate({
          'right': '0'
      }, 600);
      _parentItem.addClass(collapsedClass);
    }
  }

  var _hasRight = function functionName() {
    return jQuery(wrapper).hasClass(panelRight);
  }
  var _hasScroll = function functionName() {
    return jQuery('.ec-preview-content').hasVerticalScrollBar();
  }
  var _swither = function() {
    if (_hasRight()) {
      // if (_hasScroll() == true) {
      //   jQuery(switcher).css('left', '-2.25em');
      // } else {
      //   jQuery(switcher).css('left', '-1.25em');
      // }
    }

  };

  jQuery(document).on('click', switcher, function() {
    if (_hasRight()) {
      _clickRightEvent(jQuery(this));
    } else {
      _clickEvent(jQuery(this));
    }
  });

  jQuery(window).resize(function() {
    _swither();
  });
  // jQuery(function() {
  //   _swither();
  // });

  utils.loadFuntions.push(_swither);

}(this));

(function($) {
  $.fn.hasVerticalScrollBar = function() {
    return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
  }
})(jQuery);
(function(global) {
  "use strict";
  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});

  var tabItem = '.ec-panel-tab-item';
  var tabContainer = '.ec-panel-tabs';
  var tabItemAttr = 'data-tab-content';

  var tabContentItem = '.ec-panel-tab-content-item';
  var tabContentContainer = '.ec-panel-tab-content';
  var tabContentItemAttr = 'data-tab';

  var activeClass = 'active';

  var headerIcon = '.ec-panel-header-icon';
  var searchBox = '.ec-panel-tab-content-search';
  var searchAnim = ' animated pulse';

  var pnlContent = '.ec-panel-content';
  var tabElements = '.ec-tab-elements';
  var tabActiveClass = 'ec-active';


  var _clickEvent = function(self) {
    var anim = 'animated fadeIn ';

    var _container = self.parents(tabContainer);
    _container.find(tabItem).removeClass(activeClass);
    self.addClass(activeClass);
    var _selectedTab = self.attr(tabItemAttr);

    jQuery(tabContentContainer).find(tabContentItem)
      .removeClass(activeClass)
      .removeClass(' animated fadeInRight fadeInLeft');

    jQuery(tabContentContainer)
      .find('[' + tabContentItemAttr + '="' + _selectedTab + '"]')
      .addClass(anim + activeClass);
    //animated fadeInRight
  }


  var _getActiveTab = function() {
    return jQuery(tabItem + '.' + activeClass);
  }
  jQuery(document).on('click', tabItem, function() {
    _clickEvent(jQuery(this));
  });
  jQuery(document).on('click', headerIcon, function() {
    jQuery(pnlContent).removeClass(tabActiveClass);
    jQuery(tabElements).addClass(tabActiveClass);


    jQuery(searchBox).removeClass(searchAnim);
    setTimeout(function() {
      if (_getActiveTab().attr(tabItemAttr) == 'elements') {
        jQuery(searchBox).addClass(searchAnim);
        return false;
      }
      jQuery(tabItem + '[' + tabItemAttr + '="elements"]').click();
    }, 1);

    jQuery('.ec-preview-content .selected').removeClass('selected');
    jQuery('[data-tab="elements"]').addClass(activeClass);
  });



}(this));
(function(global) {
  "use strict";
  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});

  var _item;
  var _title;
  var _content;
  var _collapsedClass;

  var _clickEvent = function({
    _self,
    item,
    title,
    content,
    collapsedClass
  }) {

    _item = item;
    _title = title;
    _content = content;
    _collapsedClass = collapsedClass;

    var _parentItem = _self.parents(_item);
    if (_parentItem.hasClass(_collapsedClass)) {
      _parentItem.find(_content).slideDown(600);
      _parentItem.removeClass(_collapsedClass);
    } else {
      _parentItem.find(_content).slideUp(600);
      _parentItem.addClass(_collapsedClass);
    }
  }


  jQuery(document).on('click', '.ec-panel-accordion-title', function() {
    _clickEvent({
      _self: jQuery(this),
      item: '.ec-panel-accordion-item',
      title: '.ec-panel-accordion-title',
      content: '.ec-panel-accordion-content',
      collapsedClass: 'collapsed'
    });
  });


  jQuery(document).on('click', '.ec-panel-settings-title', function() {
    _clickEvent({
      _self: jQuery(this),
      item: '.ec-panel-settings-item',
      title: '.ec-panel-settings-title',
      content: '.ec-panel-settings-content',
      collapsedClass: 'collapsed'
    });
  });
}(this));
(function(global) {
  "use strict";
  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});
  var functions = builder.Functions || (builder.Functions = {});

  var _groups;
  var _tag_list;
  var _groupName;
  var _menuItems = [];

  var _createMenu = function(editor) {
    for (var i = 0; i < _groups.length; i++) {
      var tempArray = [];
      tempArray[i] = [];
      _groupName = _groups[i];
      for (var j = 0; j < _tag_list.length; j++) {
        if (_tag_list[j].group == _groupName) {
          tempArray[i].push({
            text: _tag_list[j].title,
            content: _tag_list[j].content,
            onclick: function() {
              //alert(this.settings.content);
              editor.insertContent(this.settings.content);
            }
          });
        }
      }
      _menuItems[i] = {
        text: _groupName,
        menu: tempArray[i]
      };
    }
    return _menuItems;
  }

  var _tinyMceInit = function() {
    tinymce.init({
      selector: '.ec-panel-content-editor',
      height: 500,
      theme: 'modern',
      branding: false,
      relative_urls : false,
      convert_urls : false,
      forced_root_block: 'div',
      plugins: ' lineheight table  searchreplace autolink directionality  visualblocks visualchars  image link media  codesample  charmap hr    insertdatetime advlist lists textcolor wordcount   imagetools    contextmenu colorpicker textpattern ',
      toolbar1: ' fontselect fontsizeselect  | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | mybutton | lineheightselect ',
      fontsize_formats: "8px 10px 12px 14px 16px 18px 20px 24px 36px 48px",
      target_list: false,
      setup: function(editor) {
        editor.addButton('mybutton', {
          type: 'menubutton',
          text: 'Tag list',
          icon: false,
          menu: _createMenu(editor)
        });
      }
    });
  }

  var _load_content_editor = function() {
    _groups = settings.tinymce_tags.groups;
    _tag_list = settings.tinymce_tags.tags;

    _tinyMceInit();
  };
  var _load_content_editor_main = function() {
    functions.tinymce_generate=_load_content_editor;
  //  _load_content_editor();
  };

  utils.loadFuntions.push(_load_content_editor_main);

}(this));
(function(global) {
  "use strict";


  var _parentSelector = '.ec-panel-settings-align-container';
  var item = '.ec-panel-settings-align-element';
  var classActive = 'active';


  jQuery(document).on('click', item, function() {
    var self = jQuery(this);
    var _parent = self.parents(_parentSelector);
    _parent.find(item).removeClass(classActive);
    self.addClass(classActive);
  });



}(this));
(function(global) {
  "use strict";
  var _parentSelector = '.ec-panel-settings-dimension-list';

  var item = '.ec-panel-settings-dimension-item';
  var clas = 'ec-padding-all';
  var classActive = 'active';
  var button = '.ec-panel-settings-dimension-button';


  var _change = function(self) {
    var _parent = self.parents(_parentSelector);
    if (!_parent.hasClass(clas)) {
      return;
    }
    _parent.find(item).find('input').val(self.val());
  }
  jQuery(document).on('click', button, function() {
    var self = jQuery(this);
    var _parent = self.parents(_parentSelector);
    if (_parent.hasClass(clas)) {
      _parent.removeClass(clas);
      _parent.find('.ec-panel-settings-dimension-item:not(:eq(0)) input').removeAttr('readonly');
      _parent.find(item).removeClass(classActive);
      _parent.find(item + ':eq(0) ').addClass(classActive);
    } else {
      _parent.addClass(clas);
      _parent.find(item + ':not(:eq(0)) input').attr('readonly', 'readonly');
      var val = _parent.find('.ec-panel-settings-dimension-item:eq(0) input').val();

      _parent.find(item + ' input').val(val);
      _parent.find('input').change();
    }

  });

  jQuery(document).on('click', item + ' input', function() {
    var self = jQuery(this);
    var _parent = self.parents(_parentSelector);
    _parent.find(item).removeClass(classActive);
    self.parents(item).addClass(classActive);
  });


  jQuery(document).on('keyup', item + ' input', function() {
    var self = jQuery(this);
    _change(self);
  });

  jQuery(document).on('change', item + ' input', function() {
    var self = jQuery(this);
    _change(self);
  });

}(this));
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});
  var functions = builder.Functions || (builder.Functions = {});

  var _colorpicker_container = '.ec-panel-settings-color-container';
  var _colorpicker_box = '.ec-panel-settings-color-box';

  var _setting_selector = '[data-settings="yes"]';
  var _setting_type_selector = 'data-settings-type';
  var _setting_active_selector = 'selected';

  var _tab_style = '.ec-tab-styles';
  var _tab_selector = '.ec-panel-content';
  var _tab_active_class = 'ec-active';


  var _tab__editor = '.ec-tab-styles [data-tab-content="content"]';
  var _tab__style = '.ec-tab-styles [data-tab-content="style"]';
  var _tab__editor_content = '.ec-tab-styles [data-tab="content"]';
  var _tab__style_content = '.ec-tab-styles [data-tab="style"]';
  var _tab__active_class = 'active';

  var _tab__container = '.ec-tab-styles .ec-panel-tabs';
  var _tab__element_2_class = 'ec-tabs-2';
  var _tab__element_1_class = 'ec-tabs-1';

  var _tab__style_item = '.ec-tab-styles .ec-panel-settings-item';





  var ___colorpicker_apply = function(inputSelector, callback, defaultColor) {
    //var _box_selector = jQuery(inputSelector).parents(_colorpicker_container).find(_colorpicker_box);
    jQuery(inputSelector).css('background-color', defaultColor);
    var _defaultColor = utils.rgb2hex(jQuery(inputSelector).css('background-color'));

    jQuery(inputSelector).ColorPicker({
      color: _defaultColor,
      onShow: function(colpkr) {},
      onChange: function(hsb, hex, rgb) {
        //_box_selector.css('background-color', '#' + hex);
        jQuery(inputSelector).css('background-color', '#' + hex);
        callback('#' + hex);
      }
    });
  };

  var ___hide_tab_editor_active_tab_style = function() {
    jQuery(_tab__editor).hide();
    jQuery(_tab__editor_content).hide();

    jQuery(_tab__container).removeClass(_tab__element_2_class).addClass(_tab__element_1_class);

    jQuery(_tab__style).addClass(_tab__active_class);
    jQuery(_tab__style_content).addClass(_tab__active_class);
  }

  var ___show_tab_editor_active_tab_style = function() {
    jQuery(_tab__editor).css('display', '');
    jQuery(_tab__editor_content).css('display', '');

    jQuery(_tab__container).removeClass(_tab__element_1_class).addClass(_tab__element_2_class);

    jQuery(_tab__style).removeClass(_tab__active_class);
    jQuery(_tab__style_content).removeClass(_tab__active_class);

    jQuery(_tab__editor).addClass(_tab__active_class);
    jQuery(_tab__editor_content).addClass(_tab__active_class);
  }

  jQuery(document).on('click', _setting_selector, function(e) {
    e.stopPropagation();
    var _self = jQuery(this);
    var _settings_type = _self.attr(_setting_type_selector);

    jQuery(_setting_selector).removeClass(_setting_active_selector);
    _self.addClass(_setting_active_selector);

    //active style tab
    jQuery(_tab_selector).removeClass(_tab_active_class);
    jQuery(_tab_style).addClass(_tab_active_class);

    switch (_settings_type) {
      case 'text':
        _settings_text();
        ___show_tab_editor_active_tab_style();
        break;

      case 'button':
        _settings_button();
        ___hide_tab_editor_active_tab_style();
        break;

      case 'row':
        _settings_row();
        ___hide_tab_editor_active_tab_style();
        break;

      case 'image':
        _settings_image();
        ___hide_tab_editor_active_tab_style();
        break;

      case 'spacer':
        _settings_spacer();
        ___hide_tab_editor_active_tab_style();
        break;

      case 'video':
        _settings_video();
        ___hide_tab_editor_active_tab_style();
        break;

      case 'social':
        _settings_social();
        ___hide_tab_editor_active_tab_style();
        break;

      case 'divider':
        _settings_divider();
        ___hide_tab_editor_active_tab_style();
        break;



      default:
        ___hide_tab_editor_active_tab_style();
        break;
    }


    //close all settings
    jQuery(_tab__style_item).hide();

    //close all settings
    jQuery(_tab_style).find('[data-group="' + _settings_type + '"]').show();

    /*
     * close general tabs
     */

    // jQuery(_tab_style).find('[data-group="' + _settings_type + '"]').each(function() {
    //   var __self = jQuery(this);
    //   __self.show();
    //   if (__self.attr('data-type') == 'general') {
    //     __self.addClass('collapsed');
    //     __self.find('.ec-panel-settings-content').hide();
    //   }
    // });
  });

  var ___get_selected_element = function() {
    return jQuery('.ec-preview-content .selected');
  }

  var ___get_selected_element_body = function() {
    var _el = ___get_selected_element();
    if (_el.hasClass('ec-preview-content-sortable-row')) {
      return _el.find('.ec-preview-content-sortable-row-body');
    } else {
      return _el.find('.ec-preview-content-sortable-column-body');
    }
  }

  var ___get_style_property = function(style, property) {
    if (style === undefined) {
      return '';
    }
    if (style.indexOf(';') == -1) {
      return '';
    }

    var _value;
    var _arr = style.split(';');
    for (var i = 0; i < _arr.length; i++) {
      var __element = _arr[i].split(':');
      if (__element[0] == property) {
        _value = __element[1];
        break;
      }
    }
    return _value;
  }

  var ___helper_color_content_main = function(color_selector) {
    var _def_color = jQuery('.ec-preview').css('background-color');
    var _def_row_color = ___get_style_property(___get_selected_element().attr('style'), 'background-color');
    if (_def_row_color === undefined) {
      _def_row_color = _def_color;
    }
    if (_def_row_color == '') {
      _def_row_color = _def_color;
    }
    ___colorpicker_apply(color_selector,
      function(hex) {
        ___get_selected_element().css('background-color', hex);
      },
      _def_row_color);
  }

  var ___helper_color_content_body = function(color_selector) {
    var _def_color = jQuery('.ec-preview').css('background-color');
    var _def_row_body_color = ___get_style_property(___get_selected_element_body().attr('style'), 'background-color');
    if (_def_row_body_color === undefined) {
      _def_row_body_color = _def_color;
    }
    if (_def_row_body_color == '') {
      _def_row_body_color = _def_color;
    }
    ___colorpicker_apply(color_selector,
      function(hex) {
        ___get_selected_element_body().css('background-color', hex);
        ___get_selected_element_body().find('.main-column').css('background-color', hex);
      },
      _def_row_body_color);
  }
  var ___helper_color_spacer = function(color_selector) {
    var _def_color = jQuery('.ec-preview').css('background-color');
    var _def_row_body_color = ___get_style_property(___get_selected_element_body().attr('style'), 'background-color');
    if (_def_row_body_color === undefined) {
      _def_row_body_color = _def_color;
    }
    if (_def_row_body_color == '') {
      _def_row_body_color = _def_color;
    }
    ___colorpicker_apply(color_selector,
      function(hex) {
        ___get_column_element('spacer').css('background-color', hex);
      },
      _def_row_body_color);
  }
  var ___get_column_element = function(element) {
    var __body = ___get_selected_element_body();
    var __spacer = __body.find('.main-column .' + element);
    return __spacer;
  }

  var ___helper_range_slider_get_values = function(value_selector, input_selector) {
    var __height = ___get_column_element('spacer').attr('height');

    jQuery(value_selector).text(__height + 'px');
    jQuery(input_selector).val(__height);
  }

  var _settings_general = function() {
    var _general_settings_bg_color_selector = '#settings-bg-color';
    var _general_settings_bg_helper = '.ec-preview';
    var _general_settings_content_color_selector = '#settings-content-color';
    var _general_settings_content_helper = '.ec-preview-content-sortable-row-body';

    ___colorpicker_apply(_general_settings_bg_color_selector, function(hex) {
      jQuery(_general_settings_bg_helper).css('background-color', hex);
    });
    ___colorpicker_apply(_general_settings_content_color_selector, function(hex) {
      jQuery(_general_settings_content_helper).css('background-color', hex);
      jQuery(_general_settings_bg_helper).attr('data-content-bg-color', hex);

    });
  }

  var _settings_row = function() {

    ___helper_color_content_main('#row-bg-color');

    ___helper_color_content_body('#row-content-color');
  }

  var _settings_spacer = function() {

    ___helper_color_spacer('#spacer-content-bg-color');

    ___helper_range_slider_get_values('#settings-spacer-height', '#settings-spacer-slider');

  };

  var _settings_divider = function() {
    var _divider_column = ___get_column_element('divider');
    var _divider_column_p = ___get_column_element('divider .divider-table');


    //colorpicker
    var _def_color = _divider_column_p.css('border-top-color');
    ___colorpicker_apply('#settings-divider-line-color',
      function(hex) {
        jQuery('.ec-preview-content .selected .main-column .divider .divider-table').css('border-top-color', hex);
      },
      _def_color);

    //line type
    jQuery('#settings-divider-line-type').val(_divider_column_p.css('border-top-style'));

    //line height
    var __height = _divider_column_p.css('border-top-width');
    jQuery('#settings-divider-line-height-value').text(__height);
    jQuery('#settings-divider-line-height').val(__height.replace('px', ''));

    //align
    var __align = _divider_column.attr('align');
    jQuery('#settings-divider-align .ec-panel-settings-align-element').removeClass('active');
    jQuery('#settings-divider-align [data-type="' + __align + '"]').addClass('active');

    //padding
    var __padding_top = _divider_column.css('padding-top').replace('px', '');
    var __padding_bottom = _divider_column.css('padding-bottom').replace('px', '');
    var __padding_left = _divider_column.css('padding-left').replace('px', '');
    var __padding_right = _divider_column.css('padding-right').replace('px', '');
    jQuery('#settings-divider-padding [data-type="top"]').val(__padding_top);
    jQuery('#settings-divider-padding [data-type="bottom"]').val(__padding_bottom);
    jQuery('#settings-divider-padding [data-type="left"]').val(__padding_left);
    jQuery('#settings-divider-padding [data-type="right"]').val(__padding_right);

    //width
    var __width = _divider_column_p.attr('width');

    jQuery('#settings-divider-width-value').text(__width);
    jQuery('#settings-divider-width').val(__width.replace('%', ''));
  };

  var _settings_text = function() {
    var __text = ___get_column_element('text');

    //padding
    var __padding_top = __text.css('padding-top').replace('px', '');
    var __padding_bottom = __text.css('padding-bottom').replace('px', '');
    var __padding_left = __text.css('padding-left').replace('px', '');
    var __padding_right = __text.css('padding-right').replace('px', '');

    jQuery('#settings-text-padding [data-type="top"]').val(__padding_top);
    jQuery('#settings-text-padding [data-type="bottom"]').val(__padding_bottom);
    jQuery('#settings-text-padding [data-type="left"]').val(__padding_left);
    jQuery('#settings-text-padding [data-type="right"]').val(__padding_right);


    var __temp = __text;



    __temp.find('[data-shortcode]').each(function() {
      var __self = jQuery(this);
      __self.replaceWith(__self.attr('data-shortcode'));
      __self.removeAttr('data-shortcode');
    });


    tinymce.get('content-text-editor').setContent(__temp.html());
    __settings_text_keyup();
  };
  var __settings_text_keyup = function() {
    var __text = ___get_column_element('text');
    var __html = do_shortcode(tinymce.get('content-text-editor').getContent());
    __text.html(__html);
  }
  var _settings_text_helper = function() {
    //text
    tinyMCE.get('content-text-editor').on('keyup', function(ed, e) {
      __settings_text_keyup();
    });

    //text
    tinyMCE.get('content-text-editor').on('change', function(ed, e) {
      __settings_text_keyup();
    });
  }

  var _settings_button_text_helper = function() {
    jQuery('#settings-button-text').on('keyup', function(ed, e) {
      var __button = ___get_column_element('button-container .button-a');
      __button.text(jQuery(this).val());
    });
    jQuery('#settings-button-text').on('change', function(ed, e) {
      var __button = ___get_column_element('button-container .button-a');
      __button.text(jQuery(this).val());
    });
  }

  var _settings_button = function() {
    var __button = ___get_column_element('button-container');
    var __button_a = ___get_column_element('button-container .button-a');
    var __button_table = ___get_column_element('button-container .button-table');

    //padding
    var __padding_top = __button.css('padding-top').replace('px', '');
    var __padding_bottom = __button.css('padding-bottom').replace('px', '');
    var __padding_left = __button.css('padding-left').replace('px', '');
    var __padding_right = __button.css('padding-right').replace('px', '');

    jQuery('#settings-button-padding [data-type="top"]').val(__padding_top);
    jQuery('#settings-button-padding [data-type="bottom"]').val(__padding_bottom);
    jQuery('#settings-button-padding [data-type="left"]').val(__padding_left);
    jQuery('#settings-button-padding [data-type="right"]').val(__padding_right);

    //text
    __setting_button_text_editor();
    jQuery('#settings-button-text').val(__button_a.text());

    //url
    jQuery('#settings-button-url').val(__button_a.attr('data-href'));

    //bg color
    __setting_button_bgcolor();
    //text color
    __setting_button_text_color();

    if (__button_table.attr('style') == 'margin:auto') {
      jQuery('#settings-button-width-auto').attr('checked', 'checked');
      jQuery('#settings-button-width-row').hide();
    } else {
      jQuery('#settings-button-width-auto').removeAttr('checked');
      jQuery('#settings-button-width-row').show();

      var __width = Math.round(__button_table.width() / __button.width() * 100);
      jQuery('#settings-button-width-value').text(__width + '%');
      jQuery('#settings-button-width-slider').val(__width);
    }

    //align
    var __align = __button_table.attr('align');
    jQuery('#settings-button-align .ec-panel-settings-align-element').removeClass('active');
    jQuery('#settings-button-align [data-type="' + __align + '"]').addClass('active');

    //height
    var __line_height = __button_a.css('line-height');
    jQuery('#settings-button-line-height-value').text(__line_height);
    jQuery('#settings-button-line-height').val(__line_height.replace('px', ''));


    //border color
    //
    var _def_row_color = __button_a.css('border-color');

    ___colorpicker_apply('#settings-button-border-color',
      function(hex) {
        jQuery('.ec-preview-content .selected .main-column .button-container .button-a').css('border-color', hex);
      },
      _def_row_color);

    //border style
    var __border_style = __button_a.css('border-style');
    jQuery('#settings-button-border-type').val(__border_style);

    //border width
    var __border_width = __button_a.css('border-width');
    jQuery('#settings-button-border-width-value').text(__border_width);
    jQuery('#settings-button-border-width').val(__border_width.replace('px', ''));

    _settings_button_text_helper();

  };

  var __setting_button_bgcolor = function() {
    var __button_a = ___get_column_element('button-container .button-a');
    var _def_row_color = ___get_style_property(__button_a.attr('style'), 'background-color');
    ___colorpicker_apply('#settings-button-bg-color',
      function(hex) {
        jQuery('.ec-preview-content .selected .main-column .button-container .button-a').css('background-color', hex);
        jQuery('.ec-preview-content .selected .main-column .button-container .button-a').css('background-color', hex);
      },
      _def_row_color);

  }

  var __setting_button_text_color = function() {
    var __button_a = ___get_column_element('button-container .button-a');
    var _def_row_color = __button_a.css('color');
    ___colorpicker_apply('#settings-button-text-color',
      function(hex) {
        jQuery('.ec-preview-content .selected .main-column .button-container .button-a').css('color', hex);
      },
      _def_row_color);
  }

  var __setting_button_text_editor = function() {
    // tinymce.init({
    //   forced_root_block : 'div',
    //   selector: '#settings-button-text',
    //   height: 100,
    //   menubar: false,
    //   branding: false,
    //   relative_urls : false,
    //   convert_urls : false,
    //   target_list: false,
    //   toolbar1: ' bold italic strikethrough  | alignleft aligncenter alignright alignjustify | fontselect fontsizeselect ',
    //   fontsize_formats: "8px 10px 12px 14px 16px 18px 20px 24px 36px"
    // });
  }

  var _settings_video = function() {
    var __video = ___get_column_element('video');
    var __video_a = ___get_column_element('video .video-a');

    //padding
    var __padding_top = __video.css('padding-top').replace('px', '');
    var __padding_bottom = __video.css('padding-bottom').replace('px', '');
    var __padding_left = __video.css('padding-left').replace('px', '');
    var __padding_right = __video.css('padding-right').replace('px', '');

    jQuery('#settings-video-padding [data-type="top"]').val(__padding_top);
    jQuery('#settings-video-padding [data-type="bottom"]').val(__padding_bottom);
    jQuery('#settings-video-padding [data-type="left"]').val(__padding_left);
    jQuery('#settings-video-padding [data-type="right"]').val(__padding_right);

    var __href = __video_a.attr('data-href');
    if (__href == '#') {
      __href = '';
    }
    jQuery('#settings-video-url').val(__href);
  };

  var _settings_image = function() {
    var __column = ___get_column_element('image');
    var __img = ___get_column_element('image .img');
    var __img_a = ___get_column_element('image .image-a');

    //padding
    var __padding_top = __column.css('padding-top').replace('px', '');
    var __padding_bottom = __column.css('padding-bottom').replace('px', '');
    var __padding_left = __column.css('padding-left').replace('px', '');
    var __padding_right = __column.css('padding-right').replace('px', '');

    jQuery('#settings-image-padding [data-type="top"]').val(__padding_top);
    jQuery('#settings-image-padding [data-type="bottom"]').val(__padding_bottom);
    jQuery('#settings-image-padding [data-type="left"]').val(__padding_left);
    jQuery('#settings-image-padding [data-type="right"]').val(__padding_right);


    //alt text
    var _alt_text = __img.attr('alt');
    jQuery('#settings-image-alt-text').val(_alt_text);


    //alt text
    var __source_url = __img.attr('src');
    jQuery('#settings-image-source-url').val(__source_url);


    //url
    var __href = __img_a.attr('data-href');
    jQuery('#settings-image-url').val(__href);

    //align
    var __align = __column.attr('align');
    jQuery('#settings-image-align .ec-panel-settings-align-element').removeClass('active');
    jQuery('#settings-image-align [data-type="' + __align + '"]').addClass('active');

    // width
    var __autoWidth = __img.attr('data-auto-width');
    if (__autoWidth == 'true') {
      jQuery('#settings-image-width-row').hide();
      jQuery('#settings-image-width-auto').attr('checked', 'checked');
      jQuery('#settings-image-width-value').text('100%');
      jQuery('#settings-image-width').val('100');
    } else {
      jQuery('#settings-image-width-row').show();
      jQuery('#settings-image-width-auto').removeAttr('checked', 'checked');

      jQuery('#settings-image-width-value').text(__img.attr('data-percent') + '%');
      jQuery('#settings-image-width').val(__img.attr('data-percent'));
    }

    //height
    var __height = __img.css('height').replace('px', '');
    jQuery('#settings-image-height').val(__height);

    jQuery("<img/>").load(function(){
        __img.attr('data-original-width',this.width);
        __img.attr('data-original-height',this.height);

        var __email_width=jQuery('#settings-email-width').val();
        if (this.width>__email_width) {
          __img.css('width',__email_width);
        }else {
          __img.css('width',this.width);
        }
    }).attr("src", __source_url);

  }

  var _settings_social = function() {
    var __column = ___get_column_element('social');


    //padding
    var __padding_top = __column.css('padding-top').replace('px', '');
    var __padding_bottom = __column.css('padding-bottom').replace('px', '');
    var __padding_left = __column.css('padding-left').replace('px', '');
    var __padding_right = __column.css('padding-right').replace('px', '');

    jQuery('#settings-social-padding [data-type="top"]').val(__padding_top);
    jQuery('#settings-social-padding [data-type="bottom"]').val(__padding_bottom);
    jQuery('#settings-social-padding [data-type="left"]').val(__padding_left);
    jQuery('#settings-social-padding [data-type="right"]').val(__padding_right);


    //type
    var __type = __column.attr('data-icon-type');
    jQuery('#settings-social-type').val(__type);

    //url
    var __spacing = __column.attr('data-icon-spacing');
    jQuery('#settings-social-spacing').val(__spacing);
    jQuery('#settings-social-spacing-value').text(__spacing + 'px');

    //align
    var __align = __column.attr('align');
    jQuery('#settings-social-align .ec-panel-settings-align-element').removeClass('active');
    jQuery('#settings-social-align [data-type="' + __align + '"]').addClass('active');


    __column.find('.social-icon').each(function() {
      var __self = jQuery(this);
      var __type = __self.attr('data-type');


      var __social_item = jQuery('.ec-social-elements .ec-panel-settings-row[data-type="' + __type + '"]');
      var __checkbox = __social_item.find('.ec-panel-settings-checkbox');
      var __input = __social_item.find('.ec-panel-settings-input');

      if (__self.css('display') == 'none') {
        __checkbox.removeAttr('checked');
      } else {
        __checkbox.attr('checked', 'checked');
      }

      __input.val(__self.attr('data-href'));

    });

    setTimeout(function() {
      var startIndex, changeIndex, uiHeight;

      jQuery('.ec-social-elements ').sortable({
        'placeholder': 'marker',
        axis: 'y',
        handle: '.ec-social-handle',
        start: function(e, ui) {

          startIndex = ui.placeholder.index();
          uiHeight = ui.item.outerHeight(true); //get offset incl margin

          ui.item.nextAll('.ec-panel-settings-row:not(.marker)').css({
            transform: 'translateY(' + uiHeight + 'px)'
          });

          ui.placeholder.css({
            height: 0,
            padding: 0
          });
        },
        change: function(e, ui) {

          changeIndex = ui.placeholder.index();


          if (startIndex > changeIndex) {

            var slice = jQuery('.ec-social-elements .ec-panel-settings-row').slice(changeIndex, jQuery('.ec-social-elements .ec-panel-settings-row').length);

            slice.not('.ui-sortable-helper').each(function() {
              var item = $(this);
              item.css({
                transform: 'translateY(' + uiHeight + 'px)'
              });
            });

          } else if (startIndex < changeIndex) {

            var slice = jQuery('.ec-social-elements .ec-panel-settings-row').slice(startIndex, changeIndex);

            slice.not('.ui-sortable-helper').each(function() {
              var item = jQuery(this);
              item.css({
                transform: 'translateY(0px)'
              });
            });
          }

          startIndex = changeIndex
        },
        stop: function(e, ui) {
          jQuery('.ui-sortable-handle,.ec-social-elements .ec-panel-settings-row').css({
            transform: 'translateY(0)',
            'left': '',
            'top': '',
            'position': ''
          });
          ___helper_social_change_order();
        }
      });
    }, 100);



  }
  var ___helper_social_change_order = function() {
    var __result = jQuery('<div/>');
    var __column = ___get_column_element('social');

    __result.html(__column.html());
    __column.html('');

    jQuery('.ec-social-elements .ec-panel-settings-row').each(function() {
      var __self = jQuery(this);
      __column.append(__result.find('[data-type="' + __self.attr('data-type') + '"]'));

    });
  };

  var ___helper_get_video_id = function(url) {

    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

    if (RegExp.$3.indexOf('youtu') > -1) {
      var type = 'youtube';
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
      var type = 'vimeo';
    }

    return {
      type: type,
      id: RegExp.$6
    };

  }

  var _load_panel_settings = function() {

    _settings_general();

    functions.settings_text_helper=_settings_text_helper;
    utils.helper_settings_video_url = ___helper_settings_video_url;
  };


  utils.loadFuntions.push(_load_panel_settings);

  //genreal settings
  jQuery(document).on('change', '#settings-email-width', function(e) {
    var _self = jQuery(this);
    var _body = jQuery('.ec-preview-content .ec-preview-content-sortable-row-body');
    _body.css('width', _self.val());
    _body.find('.main-row').attr('width', _self.val());

    jQuery('#settings-email-width-value').text(_self.val());

    jQuery('.ec-preview-content-sortable-row-body .image .img').each(function () {
      var __img=jQuery(this);
      var _pr_image=__img.parents('.image');
      var __width=_self.val()-parseInt(_pr_image.css('padding-left').replace('px',''))-parseInt(_pr_image.css('padding-right').replace('px',''));
      __img.css('max-width',__width+'px');
      if (__img.attr('data-auto-width')=='true') {
        __img.css('width', __width+'px');
        __img.attr('width', __width+'px');
      }
    });


  });

  //spacer
  jQuery(document).on('change', '#settings-spacer-slider', function(e) {

    var _self = jQuery(this);
    var __spacer = ___get_column_element('spacer');

    __spacer.attr('height', _self.val());
    jQuery('#settings-spacer-height').text(_self.val() + 'px');
  });

  //divider line type
  jQuery(document).on('change', '#settings-divider-line-type', function(e) {
    var _self = jQuery(this);
    var _divider_column_p = ___get_column_element('divider .divider-table');
    _divider_column_p.css('border-top-style', _self.val());
  });

  //divider line height
  jQuery(document).on('change', '#settings-divider-line-height', function(e) {
    var _self = jQuery(this);
    var _divider_column_p = ___get_column_element('divider .divider-table');

    jQuery('#settings-divider-line-height-value').text(_self.val() + 'px');
    _divider_column_p.css('border-top-width', _self.val() + 'px');
  });

  //divider  align
  jQuery(document).on('click', '#settings-divider-align .ec-panel-settings-align-element', function(e) {
    var _self = jQuery(this);
    var _divider_column = ___get_column_element('divider');
    _divider_column.attr('align', _self.attr('data-type'));
  });

  var __helper_padding = function(_self, _column) {
    var _all = _self.parents('.ec-padding-all');
    var _value = _self.val() + 'px';
    if (_all.length !== 0) {
      _column.css('padding', _value);
    } else {
      switch (_self.attr('data-type')) {
        case 'top':
          _column.css('padding-top', _value);
          break;
        case 'bottom':
          _column.css('padding-bottom', _value);
          break;
        case 'left':
          _column.css('padding-left', _value);
          break;
        case 'right':
          _column.css('padding-right', _value);
          break;
      }
    }

  };

  //divider padding
  jQuery(document).on('change', '#settings-divider-padding .ec-padding', function(e) {
    __helper_padding(jQuery(this), ___get_column_element('divider'));
  });

  //divider padding
  jQuery(document).on('keyup', '#settings-divider-padding .ec-padding', function(e) {
    __helper_padding(jQuery(this), ___get_column_element('divider'));
  });

  //text padding
  jQuery(document).on('change', '#settings-text-padding .ec-padding', function(e) {
    __helper_padding(jQuery(this), ___get_column_element('text'));
  });

  //text padding
  jQuery(document).on('keyup', '#settings-text-padding .ec-padding', function(e) {
    __helper_padding(jQuery(this), ___get_column_element('text'));
  });


  //spacer
  jQuery(document).on('change', '#settings-divider-width', function(e) {

    var _self = jQuery(this);
    var _divider_column_p = ___get_column_element('divider .divider-table');

    _divider_column_p.css('width', _self.val() + '%');
    _divider_column_p.attr('width', _self.val() + '%');

    jQuery('#settings-divider-width-value').text(_self.val() + '%');
  });


  var __helper_button_url = function(self) {
    var ___a = ___get_column_element('button-container .button-a');
    ___a.attr('data-href', self.val());
  }
  //button url
  jQuery(document).on('change', '#settings-button-url', function(e) {
    __helper_button_url(jQuery(this));
  });
  //button url
  jQuery(document).on('keyup', '#settings-button-url', function(e) {
    __helper_button_url(jQuery(this));
  });

  //button padding
  jQuery(document).on('change', '#settings-button-padding .ec-padding', function(e) {
    __helper_padding(jQuery(this), ___get_column_element('button-container'));
  });

  //button padding
  jQuery(document).on('keyup', '#settings-button-padding .ec-padding', function(e) {
    __helper_padding(jQuery(this), ___get_column_element('button-container'));
  });

  //button auto width
  jQuery(document).on('change', '#settings-button-width-auto', function(e) {
    if (jQuery(this).is(':checked')) {
      jQuery('#settings-button-width-row').hide();
      ___get_column_element('button-container .button-table').attr('style', 'margin:auto');
    } else {
      jQuery('#settings-button-width-row').show();
    }
  });

  //button width
  jQuery(document).on('change', '#settings-button-width-slider', function(e) {
    var _self = jQuery(this);
    var __button_table = ___get_column_element('button-container .button-table');

    if (_self.val()!="0") {
      jQuery('#settings-button-width-value').text(_self.val() + '%');
      __button_table.css('width', _self.val() + '%');
    }

  });

  //button  align
  jQuery(document).on('click', '#settings-button-align .ec-panel-settings-align-element', function(e) {
    var _self = jQuery(this);
    var __button_table = ___get_column_element('button-container .button-table');
    __button_table.attr('align', _self.attr('data-type'));
  });

  //button line height
  jQuery(document).on('change', '#settings-button-line-height', function(e) {
    var _self = jQuery(this);
    var __button_a = ___get_column_element('button-container .button-a');

    jQuery('#settings-button-line-height-value').text(_self.val() + 'px');
    __button_a.css('line-height', _self.val() + 'px');
  });

  //button type
  jQuery(document).on('change', '#settings-button-border-type', function(e) {
    var _self = jQuery(this);
    var __button_a = ___get_column_element('button-container .button-a');
    __button_a.css('border-style', _self.val());
  });

  //button width
  jQuery(document).on('change', '#settings-button-border-width', function(e) {
    var _self = jQuery(this);
    var __button_a = ___get_column_element('button-container .button-a');

    jQuery('#settings-button-border-width-value').text(_self.val() + 'px');
    __button_a.css('border-width', _self.val() + 'px');
  });

  //video padding
  jQuery(document).on('change', '#settings-video-padding .ec-padding', function(e) {
    __helper_padding(jQuery(this), ___get_column_element('video'));
  });

  //video padding
  jQuery(document).on('keyup', '#settings-video-padding .ec-padding', function(e) {
    __helper_padding(jQuery(this), ___get_column_element('video'));
  });

  var ___helper_video_image_url_generator = function(url, container) {
    var videoObj = ___helper_get_video_id(url);
    if (videoObj.type == 'youtube') {
      ___helper_video_set_image('https://img.youtube.com/vi/' + videoObj.id + '/hqdefault.jpg', container);
    } else if (videoObj.type == 'vimeo') {
      jQuery.get('http://vimeo.com/api/v2/video/' + videoObj.id + '.json', function(data) {
        ___helper_video_set_image(data[0].thumbnail_large, container);
      });
    }

  }

  var ___helper_video_set_image = function(image_url, container) {
    var __video_image = container.find('.video-image');
    __video_image.css('background-image', "url('" + image_url + "')");
  }

  var ___helper_settings_video_url = function(__url, container) {
    var __video_a = container.find('.video-a');
    ___helper_video_image_url_generator(__url, container);
    __video_a.attr('data-href', __url);
  };

  //video url
  jQuery(document).on('change', '#settings-video-url', function(e) {
    ___helper_settings_video_url(jQuery(this).val(), ___get_column_element('video'));
  });
  //video url
  jQuery(document).on('keyup', '#settings-video-url', function(e) {
    ___helper_settings_video_url(jQuery(this).val(), ___get_column_element('video'));
  });

  //image alt text
  jQuery(document).on('change', '#settings-image-alt-text', function(e) {
    var _self = jQuery(this);
    var __img = ___get_column_element('image .img');
    __img.attr('alt', _self.val());
  });

  //image source url
  jQuery(document).on('change', '#settings-image-source-url', function(e) {
    var _self = jQuery(this);
    var __img = ___get_column_element('image .img');
    __img.attr('src', _self.val());

    jQuery("<img/>").load(function(){
        __img.attr('data-original-width',this.width);
        __img.attr('data-original-height',this.height);
        var __email_width=jQuery('#settings-email-width').val();
        if (this.width>__email_width) {
          __img.css('width',__email_width);
        }else {
          __img.css('width',this.width);
        }
    }).attr("src", _self.val());

  });
  //image source url
  jQuery(document).on('keyup', '#settings-image-source-url', function(e) {
    var _self = jQuery(this);
    var __img = ___get_column_element('image .img');
    __img.attr('src', _self.val());
  });

  //image url
  jQuery(document).on('change', '#settings-image-url', function(e) {
    var _self = jQuery(this);
    var __img_a = ___get_column_element('image .image-a');
    __img_a.attr('data-href', _self.val());
  });

  //image width
  jQuery(document).on('change', '#settings-image-width', function(e) {
    var _self = jQuery(this);
    var __img = ___get_column_element('image .img');
    var __img_orig_width=parseInt(__img.attr('data-original-width'),10);
    var ___img_width=Math.floor(__img_orig_width*_self.val()/100);

    var ___emai_width=jQuery('#settings-email-width').val();
    if (___img_width>___emai_width) {
      ___img_width=___emai_width;
    }

    jQuery('#settings-image-width-value').text(_self.val() + '%');
    __img.css('width', ___img_width + 'px');
    __img.attr('width', ___img_width + 'px');

    __img.attr('height', 'auto');
    __img.css('height', 'auto');

    __img.attr('data-percent', _self.val());
    __img.attr('data-percent-width', ___img_width);
  });
  jQuery(document).on('change', '#settings-image-width-auto', function(e) {
    var __img = ___get_column_element('image .img');
    if (jQuery(this).is(':checked')) {
      jQuery('#settings-image-width-row').hide();

      __img.attr('data-auto-width', 'true');

      var ___img_width=parseInt(__img.attr('data-original-width'),10);
      var ___email_width=jQuery('#settings-email-width').val();
      if (___img_width>___email_width) {
        ___img_width=___email_width;
        __img.css('width', ___img_width+'px');
        __img.attr('width', ___img_width+'px');
      }else {
        __img.css('width', '');
        __img.attr('width', '');
      }
    } else {
      jQuery('#settings-image-width-row').show();
        var ____img_width='';
        if (__img.attr('data-percent-width')===undefined) {
          ____img_width=__img.width();
        }else {
          ____img_width=__img.attr('data-percent-width');
          jQuery('#settings-image-width-value').text(__img.attr('data-percent') + '%');
        }

      __img.attr('data-auto-width', 'false');
      __img.css('width', ____img_width+'px');
      __img.attr('width', ____img_width+'px');
    }
  });


  //image height
  jQuery(document).on('change', '#settings-image-height', function(e) {
    var _self = jQuery(this);
    var __img = ___get_column_element('image .img');

    __img.css('height', _self.val() + 'px');
  });
  //image height
  jQuery(document).on('keyup', '#settings-image-height', function(e) {
    var _self = jQuery(this);
    var __img = ___get_column_element('image .img');

    __img.css('height', _self.val() + 'px');
  });

  //image padding
  jQuery(document).on('change', '#settings-image-padding .ec-padding', function(e) {
    __helper_padding(jQuery(this), ___get_column_element('image'));
    jQuery('.ec-preview-content-sortable-row-body .image .img').each(function () {
      var __img=jQuery(this);
      var _pr_image=__img.parents('.image');
      var __width=jQuery('#settings-email-width').val()-parseInt(_pr_image.css('padding-left').replace('px',''))-parseInt(_pr_image.css('padding-right').replace('px',''));
      __img.css('max-width',__width+'px');
    });

  });

  //image padding
  jQuery(document).on('keyup', '#settings-image-padding .ec-padding', function(e) {
    __helper_padding(jQuery(this), ___get_column_element('image'));
    jQuery('.ec-preview-content-sortable-row-body .image .img').each(function () {
      var __img=jQuery(this);
      var _pr_image=__img.parents('.image');
      var __width=jQuery('#settings-email-width').val()-parseInt(_pr_image.css('padding-left').replace('px',''))-parseInt(_pr_image.css('padding-right').replace('px',''));
      __img.css('max-width',__width+'px');
    });
  });

  //button  align
  jQuery(document).on('click', '#settings-image-align .ec-panel-settings-align-element', function(e) {
    var _self = jQuery(this);
    var __image = ___get_column_element('image');
    __image.attr('align', _self.attr('data-type'));
  });


  //social align
  jQuery(document).on('click', '#settings-social-align .ec-panel-settings-align-element', function(e) {
    var _self = jQuery(this);
    var __element = ___get_column_element('social');
    __element.attr('align', _self.attr('data-type'));
  });

  //social type
  jQuery(document).on('change', '#settings-social-type', function(e) {
    var _self = jQuery(this);
    var __column = ___get_column_element('social');
    var __img = ___get_column_element('social img');


    var __old_type = __column.attr('data-icon-type');

    __img.each(function() {
      var ___self = jQuery(this);
      var __old_url = ___self.attr('src');
      ___self.attr('src', __old_url.replace('/' + __old_type + '/', '/' + _self.val() + '/'));
    });


    __column.attr('data-icon-type', _self.val());
  });

  //social padding
  jQuery(document).on('change', '#settings-social-padding .ec-padding', function(e) {
    __helper_padding(jQuery(this), ___get_column_element('social'));
  });

  //social padding
  jQuery(document).on('keyup', '#settings-social-padding .ec-padding', function(e) {
    __helper_padding(jQuery(this), ___get_column_element('social'));
  });

  //social spacing
  jQuery(document).on('change', '#settings-social-spacing', function(e) {
    var _self = jQuery(this);
    var __element = ___get_column_element('social');
    var __icon = ___get_column_element('social .social-icon');

    __element.attr('align', _self.attr('data-type'));
    __icon.css('margin', '0 ' + _self.val() + 'px');
    __element.attr('data-icon-spacing', _self.val());
    jQuery('#settings-social-spacing-value').text(_self.val() + 'px');
  });

  //social
  jQuery(document).on('change', '.ec-social-elements .ec-panel-settings-checkbox', function(e) {
    var __self = jQuery(this);
    var __row = __self.parents('.ec-panel-settings-row');
    var __element = ___get_column_element('social');

    if (__self.is(':checked')) {
      __element.find('[data-type="' + __row.attr('data-type') + '"]').css('display', 'inline-block');
    } else {
      __element.find('[data-type="' + __row.attr('data-type') + '"]').css('display', 'none');
    }
  });

  //social
  jQuery(document).on('change', '.ec-social-elements .ec-panel-settings-input', function(e) {
    var __self = jQuery(this);
    var __row = __self.parents('.ec-panel-settings-row');
    var __element = ___get_column_element('social');

    __element.find('[data-type="' + __row.attr('data-type') + '"]').attr('data-href', __self.val());
  });

}(this));
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});


  var _id_attr = 'data-id';
  var _structure_item = '.ec-structure-element-item';
  var _structure_item_view = '.ec-structure-element-view';


  var _loadStructure = function() {
    jQuery(_structure_item).each(function(index) {
      var _web_url = woo_ec_vars.plugin_url;
      var _element = jQuery(this);
      var _view = _element.find(_structure_item_view);
      var _id = parseInt(_element.attr(_id_attr));
      var url = _web_url + utils.structure.where(_id)[0].url;

      (function(_view, url, index) {

        utils.loadFile(url, function(response) {
          settings.structure.list[index].content = response;
          _view.html(response);
        });

      }(_view, url, index));

    });

  };

  //load
  // jQuery(function() {
  //   //utils.structure.list;
  //   _loadStructure();
  // });


  utils.loadFuntions.push(_loadStructure);


}(this));
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});
  var templates = builder.Templates || (builder.Templates = {});

  var _templateBlock = function(id, imageSrc, name, insertText) {
    return templates.block(id, imageSrc, name, insertText);
  }
  var _templateNodata = function(message) {
    return templates.block_no_data(message);
  }
  var _generateBlockList = function(_list) {
    var _temp_list = '';
    //if there is not any information
    if (_list.length == 0) {
      _temp_list = _templateNodata(settings.languages.modal_library_no_data);
      return _temp_list;
    }
    var _insertText = settings.languages.modal_library_insert;
    for (var i = 0; i < _list.length; i++) {
      _temp_list += _templateBlock(_list[i].id, _list[i].thumbnail, _list[i].name, _insertText);
    }
    return _temp_list;
  }

  var _getList = function() {
    var _plugin_url = woo_ec_vars.plugin_url;
    var _web_version = woo_ec_vars.version;
    for (var i = 0; i < settings.blocks.list.length; i++) {

      if (settings.blocks.list[i].data != undefined) {
        if (settings.blocks.list[i].data.indexOf(_plugin_url) == -1) {
          settings.blocks.list[i].data = _plugin_url + settings.blocks.list[i].data + '?v=' + _web_version;
        }
      }
      if (settings.blocks.list[i].preview != undefined) {
        if (settings.blocks.list[i].preview.indexOf(_plugin_url) == -1) {
          settings.blocks.list[i].preview = _plugin_url + settings.blocks.list[i].preview + '?v=' + _web_version;
        }
      }
      if (settings.blocks.list[i].thumbnail != undefined) {
        if (settings.blocks.list[i].thumbnail.indexOf(_plugin_url) == -1) {
          settings.blocks.list[i].thumbnail = _plugin_url + settings.blocks.list[i].thumbnail + '?v=' + _web_version;
        }
      }

    }

    return settings.blocks.list;
  }

  var _getItemById = function(_id) {
    return _.where(_getList(), {
      id: _id
    });
  }

  var _getItemByCategoryId = function(_list, _id) {
    var _result = _getList();
    if (_id == -1) {
      _result = _list;
    } else {
      _result = _.where(_list, {
        category: _id
      });
    }
    return _result;
  }


  var _getSearch = function(category, _name) {
    var _list = _getList();
    if (category == -1 && _name.length == 0) {

      return _list;
    } else if (category != -1 && _name.length == 0) {

      return _.where(_list, {
        category: category
      });
    } else if (category == -1 && _name.length != 0) {

      return _.filter(_list, function(item) {
        return item.name.toLowerCase().indexOf(_name.toLowerCase()) != -1;
      });
    } else {

      return _.filter(_list, function(item) {
        return item.name.toLowerCase().indexOf(_name.toLowerCase()) != -1 && item.category == category;
      });
    }
  }


  var _load_helper_block = function() {
    utils.blocks = utils.blocks || (utils.blocks = {});
    utils.blocks.list = _getList();
    utils.blocks.generate = _generateBlockList;
    utils.blocks.where = _getItemById;
    utils.blocks.search = _getSearch;
  };

  utils.loadFuntions.push(_load_helper_block);

}(this));
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});
  var templates = builder.Templates || (builder.Templates = {});

  var _template = function functionName(id, name) {
    return templates.block_category(id, name);
  }

  var _getList = function() {
    var _list = settings.blocks.category;
    var _temp_list = _template("-1", settings.languages.modal_library_category);
    for (var i = 0; i < _list.length; i++) {
      _temp_list += _template(_list[i].id, _list[i].name);
    }
    return _temp_list;
  }

  var _load_helper_block_category = function() {
    utils.getBlocksCategory = _getList();
  };
  utils.loadFuntions.push(_load_helper_block_category);

}(this));
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});
  var templates = builder.Templates || (builder.Templates = {});

  var _template = function functionName(id, imageSrc, name, insertText) {
    return templates.template(id, imageSrc, name, insertText);
  }
  var _templateNodata = function(message) {
    return templates.template_no_data(message);
  }

  var _generateTemplateList = function(_list) {
    var _temp_list = '';
    if (_list.length == 0) {
      _temp_list = _templateNodata(settings.languages.modal_library_no_data);
      return _temp_list;
    }
    var _insertText = settings.languages.modal_library_insert;
    for (var i = 0; i < _list.length; i++) {
      _temp_list += _template(_list[i].id, _list[i].thumbnail, _list[i].name, _insertText);
    }
    return _temp_list;
  }

  var _getList = function() {
    var _plugin_url = woo_ec_vars.plugin_url;
    var _web_version = woo_ec_vars.version;
    for (var i = 0; i < settings.templates.list.length; i++) {

      if (settings.templates.list[i].data != undefined) {
        if (settings.templates.list[i].data.indexOf(_plugin_url) == -1) {
          settings.templates.list[i].data = _plugin_url + settings.templates.list[i].data + '?v=' + _web_version;
        }
      }
      if (settings.templates.list[i].preview != undefined) {
        if (settings.templates.list[i].preview.indexOf(_plugin_url) == -1) {
          settings.templates.list[i].preview = _plugin_url + settings.templates.list[i].preview + '?v=' + _web_version;
        }
      }
      if (settings.templates.list[i].thumbnail != undefined) {
        if (settings.templates.list[i].thumbnail.indexOf(_plugin_url) == -1) {
          settings.templates.list[i].thumbnail = _plugin_url + settings.templates.list[i].thumbnail + '?v=' + _web_version;
        }
      }

    }
    return settings.templates.list;
  }

  var _getItemById = function(_id) {
    return _.where(_getList(), {
      id: _id
    });
  }

  var _getItemByCategoryId = function(_list, _id) {
    var _result = _getList();
    if (_id == -1) {
      _result = _list;
    } else {
      _result = _.where(_list, {
        category: _id
      });
    }
    return _result;
  }


  var _getSearch = function(category, _name) {
    utils.writeMessage('_helperTemplate.js', '_getSearch', 'category:' + category + ' --- name: ' + _name);
    var _list = _getList();
    if (category == -1 && _name.length == 0) {

      return _list;
    } else if (category != -1 && _name.length == 0) {

      return _.where(_list, {
        category: category
      });
    } else if (category == -1 && _name.length != 0) {

      return _.filter(_list, function(item) {
        return item.name.toLowerCase().indexOf(_name.toLowerCase()) != -1;
      });
    } else {

      return _.filter(_list, function(item) {
        return item.name.toLowerCase().indexOf(_name.toLowerCase()) != -1 && item.category == category;
      });
    }
  }


  var _load_helper_template = function() {
    utils.templates = utils.templates || (utils.templates = {});
    utils.templates.list = _getList();
    utils.templates.generate = _generateTemplateList;
    utils.templates.where = _getItemById;
    utils.templates.search = _getSearch;
  };
  utils.loadFuntions.push(_load_helper_template);

}(this));
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});
  var templates = builder.Templates || (builder.Templates = {});

  var _template = function(id, name) {
    return templates.template_category(id, name);
  }

  var _getList = function() {
    var _list = settings.templates.category;
    var _temp_list = _template("-1", settings.languages.modal_library_category);
    for (var i = 0; i < _list.length; i++) {
      _temp_list += _template(_list[i].id, _list[i].name);
    }
    return _temp_list;
  }

  var _load_helper_template_cat = function() {
    utils.getTemplatesCategory = _getList();
  };
  utils.loadFuntions.push(_load_helper_template_cat);

}(this));
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});
  var templates = builder.Templates || (builder.Templates = {});

  var _template = function functionName(id, date, name, insertText, previewText, deleteText, plugin_url) {
    return templates.template_saved(id, date, name, insertText, previewText, deleteText, plugin_url);
  }

  var _templateNodata = function(message) {
    return templates.template_saved_no_data(message);
  }
  var _templateHeader = function(name, date, actions) {
    return templates.template_saved_header(name, date, actions);
  }
  /**/
  var _generateTemplateList = function(_list) {
    utils.writeMessage("_helperTemplateSaved", "_generateTemplateList", _list);

    var _temp_list = '';

    //if there is not any information
    if (_list.length == 0) {
      _temp_list = _templateNodata(settings.languages.modal_library_no_data);
      return _temp_list;
    }

    var _text_insert = settings.languages.modal_library_insert;
    var _text_delete = settings.languages.modal_library_delete;
    var _text_preview = settings.languages.modal_library_preview;

    var _text_column1 = settings.languages.modal_library_column_name;
    var _text_column2 = settings.languages.modal_library_column_date;
    var _text_column3 = settings.languages.modal_library_column_actions;
    var plugin_url = woo_ec_vars.plugin_url;

    _temp_list = _templateHeader(_text_column1, _text_column2, _text_column3);
    for (var i = 0; i < _list.length; i++) {
      _temp_list += _template(
        _list[i].id,
        _list[i].date,
        _list[i].name,
        _text_insert,
        _text_preview,
        _text_delete,
        plugin_url
      );
    }
    return _temp_list;
  }
  // var _loadSavedTemplates = function() {
  //   var _loadSavedTemplates = function() {
  //     utils.loadJson(dir_saved_templates, function(response) {
  //       settings.saved_templates = response;
  //     });
  //   }
  // }

  var _getList = function() {
    return settings.saved_templates.list;
  }

  var _getItemById = function(_id) {
    return _.where(_getList(), {
      id: _id
    });
  }

  var _getSearch = function(_name) {

    utils.writeMessage('_helperTemplateSaved.js', '_getSearch', ' name: ' + _name);

    var _list = _getList();
    if (_name.length == 0) {
      return _list;
    } else {
      return _.filter(_list, function(item) {
        return item.name.toLowerCase().indexOf(_name.toLowerCase()) != -1;
      });
    }
  }


  var _load_helper_template_saved = function() {
    utils.saved_templates = utils.saved_templates || (utils.saved_templates = {});
    utils.saved_templates.list = _getList;
    utils.saved_templates.generate = _generateTemplateList;
    utils.saved_templates.where = _getItemById;
    utils.saved_templates.search = _getSearch;
  };

  utils.loadFuntions.push(_load_helper_template_saved);

}(this));
(function() {
  "use strict";

  var hoverClass = 'hover';
  var column = '.ec-preview-content-sortable-column';
  var row = '.ec-preview-content-sortable-row';
  var _preview_content = '.ec-preview-content';
  var _mouseoverHelper = function(self) {
    if (jQuery(_preview_content).attr('data-draggable') != 'yes') {
      self.addClass(hoverClass);
    }

  }
  var _mouseoutHelper = function(self) {
    self.removeClass(hoverClass);
  }

  jQuery(document).on('mouseover', column, function(e) {
    e.stopPropagation();
    _mouseoverHelper(jQuery(this));
  });
  jQuery(document).on('mouseout', column, function(e) {
    e.stopPropagation();
    _mouseoutHelper(jQuery(this));
  });

  jQuery(document).on('mouseover', row, function(e) {
    e.stopPropagation();
    _mouseoverHelper(jQuery(this));
  });
  jQuery(document).on('mouseout', row, function(e) {
    e.stopPropagation();
    _mouseoutHelper(jQuery(this));
  });

})();
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var functions = builder.Functions || (builder.Functions = {});
  var settings = builder.Settings || (builder.Settings = {});
  var templates = builder.Templates || (builder.Templates = {});



  var subMenuOpen = 'ec-header-sub-menu-open';
  var hasSubMenu = '.ec-header-has-sub-menu';
  var icon = '.ec-preview-header-control-item-icon';
  var item = '.ec-preview-header-control-item';
  var container = '.ec-preview-header-control-container';
  var rowBody = '.ec-preview-content-sortable-row-body';
  var lastClickedIndex = -1;

  jQuery(document).on('click', icon, function(e) {
    e.preventDefault();

    var self = jQuery(this);
    var parent = self.parent();
    if (parent.hasClass('ec-preview-header-control-item-disable')) {
      return false;
    }
    if (lastClickedIndex != parent.index()) {
      jQuery(item).removeClass(subMenuOpen);
    }

    if (parent.hasClass(subMenuOpen)) {
      parent.removeClass(subMenuOpen);
    } else {
      parent.addClass(subMenuOpen);
    }

    lastClickedIndex = parent.index();

  });

  jQuery(document).on('click', function(e) {
    if (jQuery(e.target).parents(container).length == 0) {
      jQuery(item).removeClass(subMenuOpen);
    }
  });

  jQuery(document).on('click', '.ec-control-blank', function(e) {
    utils.remove_modal(function() {
      utils.load_default_row();
    });
  });

  var __helper_export_get_element_bg = function(self) {
    var __bg = '';
    if (self.attr('style') === undefined) {
      return __bg;
    }

    if (self.attr('style').indexOf('background-color') > -1) {
      __bg = self.css('background-color');
    }

    return __bg;
  }
  var __helper_export_html = function(change_shortcode) {

    if (change_shortcode === undefined) {
      change_shortcode = true;
    }


    var __exported_rows = '';

    var __preview_content = jQuery('<div/>');

    __preview_content.html(jQuery('.ec-preview-content').html());

    __preview_content.find('.wc-item-downloads').css({
      'margin':'0',
      'padding':'0',
      'list-style': 'none'
    });
    var ___width = jQuery('#settings-email-width').val();
    var ___general_bg = jQuery('.ec-preview').css('background-color');
    var ___custom_css = jQuery('#custom_css').val();
    var __direction=jQuery('#ec-settings-rtl').is(":checked")?'rtl':'ltr';
    var __lang=jQuery('#ec_woo_lang option:selected').attr('lang');

    if (change_shortcode == true) {
      __preview_content.find('[data-shortcode]').each(function() {
        var __self = jQuery(this);
        __self.replaceWith(__self.attr('data-shortcode'));
        __self.removeAttr('data-shortcode');
      });
    }


    // __preview_content.find('.main-row-table').each(function(index) {
    //   var __self = jQuery(this);
    //   var __percent = __self.attr('data-column-count');
    //
    //   var __value = Math.round((___width * __percent) / 100);
    //   __self.css('width', __value + 'px');
    //   __self.attr('width', __value + 'px');
    //
    // });

    //images
    __preview_content.find('.image .img').each(function() {
      var __self_image = jQuery(this);
      var __image_width = __self_image.css('width').replace('px', '').replace('%', '');
      if (__image_width != '0') {
        __self_image.attr('width', __image_width);
      }

      __self_image.attr('height', __self_image.css('height'));
    });

    __preview_content.find('.button-table').each(function() {
      var __self_button = jQuery(this);
      var __btn_table_width = __self_button.css('width').replace('px', '').replace('%', '');
      if (__btn_table_width == '0') {
        __self_button.css('width','');
      }else {
        __self_button.attr('width', __btn_table_width);
      }
    });

    //rows
    __preview_content.find('.ec-preview-content-sortable-row').each(function() {
      var __self_row = jQuery(this);
      var __row_body = __self_row.find('.ec-preview-content-sortable-row-body');
      var __row_main_table = __row_body.find('.main-row .main-row-table');

      var __row_bg = __self_row.css('background-color');
      var __column_bg = __row_body.css('background-color');

      __row_body.find('.main-row').css('background-color', __column_bg);


      //main row
      __row_body.find('.main-row').each(function() {
        jQuery(this).attr('width', '100%');
      });

      __row_main_table.each(function() {
        var __self_row_table = jQuery(this);
        var __row_main_column = __self_row_table.find('.main-row-column');

        __row_main_column.find('.ec-preview-content-sortable-column').each(function() {
          var __self_column = jQuery(this);
          var __column_body = __self_column.find('.ec-preview-content-sortable-column-body');

          if (__self_column.hasClass('ec-preview-content-sortable-column-empty')) {
            __self_column.remove();
          }

          if (__column_body !== undefined) {
            __self_column.html(__column_body.html());
          }

        });

        __row_main_column.html(__row_main_column.find('.ec-preview-content-sortable-column-wrapper').html());

      });

      __preview_content.find('.main-row-column').each(function() {
        var __main_row_column = jQuery(this);
        if (__main_row_column.html().trim() == '' || __main_row_column.html().trim().length == 0) {
          __main_row_column.html('&nbsp;');
        }
      });


      __self_row.html(__row_body.html());
      __self_row.html(__row_body.html());

      __exported_rows += templates.export_row(__row_bg, __row_body.html(), ___width + 'px',__direction);
    });


    var __extra_css={
       'border-collapse': 'collapse',
       'border-spacing': '0px',
       'mso-table-lspace':'0',
       'mso-table-rspace':'0'
    };
    var ____exported_rows_temp=jQuery('<div />');
    ____exported_rows_temp.html(__exported_rows);
    ____exported_rows_temp.find('table').css(__extra_css);
    ____exported_rows_temp.find('table td').css(__extra_css);

    //URLs
    ____exported_rows_temp.find('a').each(function() {
      var __self = jQuery(this);
      var __data_href = __self.attr('data-href');
      var __href = __self.attr('href');
      if (__href.indexOf('javascript:void(0);')) {
        __self.remove('href','#');
      }
      if (__data_href !== undefined) {
        __self.attr('href', __data_href);
      }

    });
    var __exported_template = __helper_template_export(___general_bg, ____exported_rows_temp.html(), ___custom_css, __lang, __direction);
    return __exported_template;
  };
  var __helper_template_export = function(bg, body,custom_css,lang,direction) {
    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
    };
    var compiled = _.template(settings.template_export);
    var item = compiled({
      email_bg_color: bg,
      email_body: body,
      custom_css: custom_css,
      lang: lang,
      direction: direction
    });
    return item;
  }

  jQuery(document).on('click', '.ec-export-html', function(e) {
    var _self = jQuery(this);
    if (_self.parents('.ec-control-export').hasClass('ec-preview-header-control-item-disable')) {
      return false;
    }

    var __html = __helper_export_html(false);
    var __data = {
      action: 'export_html',
      lang: jQuery('#ec_woo_lang').val(),
      type: jQuery('#ec_woo_type').val(),
      html: __html
    };

    ajax_request(__data, function(response) {
      window.location.href = response.url;
      jQuery(document).click();
    });

  });

  var __helper_export_json_style = function(style, property) {
    if (style === undefined) {
      return '';
    }
    if (style.indexOf(';') == -1) {
      return '';
    }

    var _value;
    var _arr = style.split(';');
    for (var i = 0; i < _arr.length; i++) {
      var __element = _arr[i].split(':');
      if (__element[0] == property) {
        _value = __element[1];
        break;
      }
    }
    return utils.rgb2hex(_value);

  }

  var __helper_export_json_element_options_text = function(element_container) {
    var __option_item = {};
    var __text = element_container.find('.main-column .text');

    __option_item.paddingTop = __text.css('padding-top');
    __option_item.paddingBottom = __text.css('padding-bottom');
    __option_item.paddingLeft = __text.css('padding-left');
    __option_item.paddingRight = __text.css('padding-right');
    __option_item.text = __text.html();
    return __option_item;
  };
  var __helper_export_json_element_options_spacer = function(element_container) {
    var __option_item = {};
    var __element = element_container.find('.main-column .spacer');
    var __body = element_container.find('.ec-preview-content-sortable-column-body');

    __option_item.contentColor = __element.css('background-color');
    __option_item.height = __element.attr('height');

    return __option_item;
  };
  var __helper_export_json_element_options_divider = function(element_container) {
    var __option_item = {};
    var __element = element_container.find('.main-column .divider');
    var __element_p = element_container.find('.main-column .divider .divider-table');

    __option_item.lineColor = utils.rgb2hex(__element_p.css('border-top-color'));
    __option_item.lineType = __element_p.css('border-top-style');
    __option_item.lineHeight = __element_p.css('border-top-width');
    __option_item.align = __element.attr('align');

    __option_item.paddingTop = __element.css('padding-top');
    __option_item.paddingBottom = __element.css('padding-bottom');
    __option_item.paddingLeft = __element.css('padding-left');
    __option_item.paddingRight = __element.css('padding-right');

    //width
    __option_item.width = __element_p.attr('width');

    return __option_item;
  };
  var __helper_export_json_element_options_video = function(element_container) {
    var __option_item = {};

    var __video = element_container.find('.main-column .video');
    var __video_a = element_container.find('.main-column .video .video-a');

    //padding
    __option_item.paddingTop = __video.css('padding-top');
    __option_item.paddingBottom = __video.css('padding-bottom');
    __option_item.paddingLeft = __video.css('padding-left');
    __option_item.paddingRight = __video.css('padding-right');

    var __href = __video_a.attr('data-href');
    if (__href == '#') {
      __href = '';
    }

    __option_item.url = __href;
    return __option_item;
  };
  var __helper_export_json_element_options_image = function(element_container) {
    var __option_item = {};

    var __element = element_container.find('.main-column');

    var __column = __element.find('.image');
    var __img = __element.find('.image .img');
    var __img_a = __element.find('.image .image-a');


    __option_item.paddingTop = __column.css('padding-top');
    __option_item.paddingBottom = __column.css('padding-bottom');
    __option_item.paddingLeft = __column.css('padding-left');
    __option_item.paddingRight = __column.css('padding-right');

    __option_item.altText = __img.attr('alt');
    __option_item.sourceUrl = __img.attr('src');
    __option_item.url = __img_a.attr('data-href');
    __option_item.align = __column.attr('align');
    __option_item.height = __img.css('height');

    __option_item.autoWidth = __img.attr('data-auto-width');
    __option_item.percentWidth = __img.attr('data-percent-width');
    __option_item.percent = __img.attr('data-percent');

    return __option_item;
  };
  var __helper_export_json_element_options_button = function(element_container) {
    var __option_item = {};

    var __element = element_container.find('.main-column');

    var __button = __element.find('.button-container');
    var __button_a = __element.find('.button-container .button-a');
    var __button_table = __element.find('.button-container .button-table');


    __option_item.paddingTop = __button.css('padding-top');
    __option_item.paddingBottom = __button.css('padding-bottom');
    __option_item.paddingLeft = __button.css('padding-left');
    __option_item.paddingRight = __button.css('padding-right');

    __option_item.text = __button_a.html();
    var __href = __button_a.attr('data-href');
    if (__href == undefined) {
      __option_item.url = '';
    } else if (__href == undefined) {
      __option_item.url = '';
    } else {
      __option_item.url = __href;
    }
    __option_item.backgroundColor = __button_a.css('background-color');
    __option_item.color = __button_a.css('color');

    __option_item.align = __button_table.attr('align');
    __option_item.lineHeight = __button_a.css('line-height');
    __option_item.borderColor = __button_a.css('border-color');
    __option_item.borderStyle = __button_a.css('border-style');
    __option_item.borderWidth = __button_a.css('border-width');


    __option_item.width = __button_a.css('border-width');

    if (__button_table.attr('style') == 'margin:auto') {
      __option_item.autoWidth = 'true';
      __option_item.width = '';
    } else {
      __option_item.autoWidth = 'false';
      //var __width = Math.round(__button_table.width() / __button.width() * 100);
      var __width = __button_table.width();
      __option_item.width = __width + '%';
    }

    return __option_item;
  };
  var __helper_export_json_element_options_social = function(element_container) {
    var __option_item = {};
    var __element = element_container.find('.main-column');

    var __column = __element.find('.social');

    __option_item.paddingTop = __column.css('padding-top');
    __option_item.paddingBottom = __column.css('padding-bottom');
    __option_item.paddingLeft = __column.css('padding-left');
    __option_item.paddingRight = __column.css('padding-right');
    __option_item.type = __column.attr('data-icon-type');
    __option_item.spacing = __column.attr('data-icon-spacing') + 'px';
    __option_item.align = __column.attr('align');

    __option_item.items = [];

    __column.find('.social-icon').each(function(index) {
      var __self = jQuery(this);
      var __type = __self.attr('data-type');


      var __item = {};
      __item.type = __type;
      __item.order = index + 1;
      if (__self.css('display') == 'none') {
        __item.show = 'no';
      } else {
        __item.show = 'yes';
      }
      var __href = __self.attr('data-href');
      if (__href === undefined) {
        __item.url = '';
      } else if (__href == '') {
        __item.url = '';
      } else {
        __item.url = __href;
      }

      __option_item.items.push(__item);
    });

    return __option_item;
  }
  var __helper_export_json_element_options = function(element_container, type) {
    var __option_item = {};

    switch (type) {
      case 'text':
        __option_item = __helper_export_json_element_options_text(element_container);
        break;

      case 'spacer':
        __option_item = __helper_export_json_element_options_spacer(element_container);
        break;

      case 'divider':
        __option_item = __helper_export_json_element_options_divider(element_container);
        break;

      case 'video':
        __option_item = __helper_export_json_element_options_video(element_container);
        break;

      case 'image':
        __option_item = __helper_export_json_element_options_image(element_container);
        break;

      case 'button':
        __option_item = __helper_export_json_element_options_button(element_container);
        break;

      case 'social':
        __option_item = __helper_export_json_element_options_social(element_container);
        break;
    }




    return __option_item;
  }

  var __helper_export_json = function() {

    var __export_json = {};
    /*
     * Rows
     */

    //create the temprary
    var __preview_content = jQuery('<div/>');

    __preview_content.html(jQuery('.ec-preview-content').html());

    //data-shortcode
    __preview_content.find('[data-shortcode]').each(function() {
      var __self = jQuery(this);
      __self.replaceWith(__self.attr('data-shortcode'));
      __self.removeAttr('data-shortcode');
    });

    __preview_content.find('*').removeAttr('rel');
    __preview_content.find('*').removeAttr('target');
    __preview_content.find('.wc-item-downloads').css({
      'margin':'0',
      'padding':'0',
      'list-style': 'none'
    });

    /*
     * Rows
     */
    var __rows = [];

    __preview_content.find(' .ec-preview-content-sortable-row').each(function() {
      var __self_row = jQuery(this);
      var __row_body = __self_row.find('.ec-preview-content-sortable-row-body');
      var __row_main_column = __row_body.find('.main-row .main-row-column');
      var __row_main_table = __row_body.find('.main-row .main-row-table');


      var __row_item = {};
      /*
       * Row Id
       */
      __row_item.id = __self_row.attr('data-id');
      __row_item.columns = [];
      /*
       * Row columns
       */
      var __column_count = 1;
      __row_main_table.each(function() {
        var __self_column = jQuery(this);
        var __column_item = {};
        __column_item.name = "column" + __column_count;
        __column_item.elements = [];

        /*
         * Row elements
         */
        __self_column.find('.ec-preview-content-sortable-column').each(function() {
          var __self_element_container = jQuery(this);

          if (!__self_element_container.hasClass('ec-preview-content-sortable-column-empty')) {
            var __element_item = {};
            var __type = __self_element_container.attr('data-settings-type');
            var __id = __self_element_container.attr('data-id');
            __element_item.type = __type;
            __element_item.id = __id;
            __element_item.options = __helper_export_json_element_options(__self_element_container, __type);

            __column_item.elements.push(__element_item);
          }
        });

        __row_item.columns.push(__column_item);
        __column_count++;
      });


      /*
       * Row options
       */
      __row_item.options = {};
      __row_item.options.backgroundColor = __self_row.css('background-color');
      __row_item.options.contentColor = __row_body.css('background-color');


      /*
       * add new row
       */
      __rows.push(__row_item);


    });


    __export_json.rows = __rows;

    /*
     * General settings
     */
    var __generalSettings = {};
    __generalSettings.width = jQuery('#settings-email-width').val() + 'px';
    __generalSettings.backgroundColor = utils.rgb2hex(jQuery('#settings-bg-color').css('background-color'));
    __generalSettings.contentColor = utils.rgb2hex(jQuery('#settings-content-color').css('background-color'));
    __export_json.settings = __generalSettings;


    __export_json.html = __helper_export_html();

    return JSON.stringify(__export_json);
  }

  jQuery(document).on('click', '.ec-export-json', function(e) {
    var _self = jQuery(this);
    if (_self.parents('.ec-control-export').hasClass('ec-preview-header-control-item-disable')) {
      return false;
    }
    var __json = __helper_export_json();
    var __data = {
      action: 'export_json',
      lang: jQuery('#ec_woo_lang').val(),
      type: jQuery('#ec_woo_type').val(),
      json: __json
    };

    ajax_request(__data, function(response) {
      window.location.href = response.url;
      jQuery(document).click();
    });
  });

  var __helper_import_json_general_settings = function(__generalSettings) {
    //bg color
    jQuery('.ec-preview').css('background-color', __generalSettings.backgroundColor);
    jQuery('#settings-bg-color').css('background-color', __generalSettings.backgroundColor);

    //content color
    jQuery('#settings-content-color').css('background-color', __generalSettings.contentColor);
    jQuery('.ec-preview').attr('data-content-bg-color', __generalSettings.contentColor);
    //jQuery('.ec-preview-content-sortable-row-body').css('background-color', __generalSettings.contentColor);
    jQuery('.ec-preview-content-sortable-row-body').each(function() {
      var _self = jQuery(this);
      var __value = __helper_export_json_style(_self.attr('style'), 'background-color');

      if (__value !== undefined) {
        if (__value != '') {
          _self.css('background-color', __generalSettings.contentColor);
        }
      }
    });
  //  console.log(__generalSettings.width);
    var __general_width=parseInt(__generalSettings.width);
    //console.log(__general_width);
    //width
    var _body = jQuery('.ec-preview-content .ec-preview-content-sortable-row-body');
    _body.css('width', __generalSettings.width);
    _body.find('.main-row').attr('width', __generalSettings.width);
    jQuery('#settings-email-width-value').text(__general_width);
    jQuery('#settings-email-width').val(__general_width);
  }
  var __helper_import_json_text = function(options, id) {
    var __element_div = jQuery('<div/>');
    var __element = utils.elements.search_id(id)[0];
    __element_div.html(templates.column(__element.name, __element.content, __element.type, __element.id));
    var __text = __element_div.find('.text');

    __text.css('padding-top', options.paddingTop);
    __text.css('padding-bottom', options.paddingBottom);
    __text.css('padding-left', options.paddingLeft);
    __text.css('padding-right', options.paddingRight);
    __text.html(options.text);

    return __element_div.html();
  };
  var __helper_import_json_spacer = function(options, id) {
    var __element_div = jQuery('<div/>');
    var __element = utils.elements.search_id(id)[0];

    __element_div.html(templates.column(__element.name, __element.content, __element.type, __element.id));
    var __spacer = __element_div.find('.spacer');
    var __body = __element_div.find('.ec-preview-content-sortable-column-body');

    __spacer.css('background-color', options.contentColor);
    __spacer.attr('height', options.height);

    __spacer.html(options.text);

    return __element_div.html();
  };
  var __helper_import_json_video = function(options, id) {
    var __element_div = jQuery('<div/>');
    var __element = utils.elements.search_id(id)[0];
    __element_div.html(templates.column(__element.name, __element.content, __element.type, __element.id));
    var __video = __element_div.find('.video');
    var __video_a = __element_div.find('.video .video-a');

    __video.css('padding-top', options.paddingTop);
    __video.css('padding-bottom', options.paddingBottom);
    __video.css('padding-left', options.paddingLeft);
    __video.css('padding-right', options.paddingRight);

    if (options.url !== undefined) {
      __video_a.attr('data-href', options.url);
      utils.helper_settings_video_url(options.url, __video);
    }


    return __element_div.html();
  };
  var __helper_import_json_button = function(options, id) {
    var __element_div = jQuery('<div/>');
    var __element = utils.elements.search_id(id)[0];
    __element_div.html(templates.column(__element.name, __element.content, __element.type, __element.id));
    var __button = __element_div.find('.button-container');
    var __button_a = __element_div.find('.button-container .button-a');
    var __button_table = __element_div.find('.button-container .button-table');
    var __button_td = __element_div.find('.button-container .button-td');

    __button.css('padding-top', options.paddingTop);
    __button.css('padding-bottom', options.paddingBottom);
    __button.css('padding-left', options.paddingLeft);
    __button.css('padding-right', options.paddingRight);
    __button_a.html(options.text);
    __button_a.attr('data-href', options.url);

    //bg color
    __button_a.css('background-color', options.backgroundColor);
    __button_td.css('background-color', options.backgroundColor);

    //text color
    __button_a.css('color', options.color);

    if (options.autoWidth == true) {
      __button_table.attr('style', 'margin:auto');
    } else {
      __button_table.attr('style', 'margin:auto;width:' + options.width);
    }

    //align
    __button_table.attr('align', options.align);

    //height
    __button_a.css('line-height', options.lineHeight);

    //border color
    __button_a.css('border-color', options.borderColor);

    //border style
    __button_a.css('border-style', options.borderStyle);

    //border width
    __button_a.css('border-width', options.borderWidth);

    return __element_div.html();
  };
  var __helper_import_json_image = function(options, id) {
    var __element_div = jQuery('<div/>');
    var __element = utils.elements.search_id(id)[0];
    __element_div.html(templates.column(__element.name, __element.content, __element.type, __element.id));


    var __column = __element_div.find('.image');
    var __img = __element_div.find('.image .img');
    var __img_a = __element_div.find('.image .image-a');

    //padding
    __column.css('padding-top', options.paddingTop);
    __column.css('padding-bottom', options.paddingBottom);
    __column.css('padding-left', options.paddingLeft);
    __column.css('padding-right', options.paddingRight);

    //alt text
    __img.attr('alt', options.altText);

    //source URL
    __img.attr('src', options.sourceUrl);

    //url
    __img_a.attr('data-href', options.url);

    //align
    __column.attr('align', options.align);

    // width
    if (options.autoWidth == 'true') {
      __img.css('width', '');
      __img.attr('data-percent', '100');
    } else {
      __img.css('width', options.percentWidth);
      __img.attr('width', options.percentWidth);
    }
    __img.attr('data-percent-width', options.percentWidth);
    __img.attr('data-percent', options.percent);
    __img.attr('data-auto-width', options.autoWidth);



    // height
    //__img.css('height', options.height);


    return __element_div.html();
  };
  var __helper_import_json_divider = function(options, id) {
    var __element_div = jQuery('<div/>');
    var __element = utils.elements.search_id(id)[0];
    __element_div.html(templates.column(__element.name, __element.content, __element.type, __element.id));
    var _divider_column = __element_div.find('.divider');
    var _divider_column_p = __element_div.find('.divider .divider-table');

    //padding
    _divider_column.css('padding-top', options.paddingTop);
    _divider_column.css('padding-bottom', options.paddingBottom);
    _divider_column.css('padding-left', options.paddingLeft);
    _divider_column.css('padding-right', options.paddingRight);

    //lineColor
    _divider_column_p.css('border-top-color', options.lineColor);

    //line type
    _divider_column_p.css('border-top-style', options.lineType);

    //line height
    _divider_column_p.css('border-top-width', options.lineHeight);

    //align
    _divider_column.attr('align', options.align);

    //width
    _divider_column_p.css('width', options.width);
    _divider_column_p.attr('width', options.width);

    return __element_div.html();
  };
  var __helper_import_json_social = function(options, id) {
    var __element_div = jQuery('<div/>');
    var __element = utils.elements.search_id(id)[0];
    __element_div.html(templates.column(__element.name, __element.content, __element.type, __element.id));

    var __column = __element_div.find('.social');
    var __icon = __column.find('.social-icon');
    var __img = __column.find('img');

    //padding
    __column.css('padding-top', options.paddingTop);
    __column.css('padding-bottom', options.paddingBottom);
    __column.css('padding-left', options.paddingLeft);
    __column.css('padding-right', options.paddingRight);

    //type
    var __old_type = __column.attr('data-icon-type');

    __img.each(function() {
      var ___self = jQuery(this);
      var __old_url = ___self.attr('src');
      ___self.attr('src', __old_url.replace('/' + __old_type + '/', '/' + options.type + '/'));
    });
    __column.attr('data-icon-type', options.type);


    //url
    __column.attr('data-icon-spacing', options.spacing.replace('px', ''));
    __icon.css('margin', '0 ' + options.spacing);

    //align
    __column.attr('align', options.align);

    var __social_item_list = options.items;

    for (var i = 0; i < __social_item_list.length; i++) {
      var __social_item = __column.find('.social-icon[data-type="' + __social_item_list[i].type + '"]');

      if (__social_item_list[i].show == 'no') {
        __social_item.css('display', 'none');
      } else {
        __social_item.css('display', 'inline-block');
      }

      __social_item.attr('data-href', __social_item_list[i].url);
    }



    /*
     *  change order
     */
    __helper_import_json_social_change_order(__social_item_list, __column);


    return __element_div.html();
  };
  var __helper_import_json_social_change_order = function(_elements_list, __column) {
    var __social_item_sorted_list = _.sortBy(_elements_list, function(item) {
      return item.order;
    });
    var __result = jQuery('<div/>');
    __result.html(__column.html());
    __column.html('');

    for (var i = 0; i < __social_item_sorted_list.length; i++) {
      __column.append(__result.find('[data-type="' + __social_item_sorted_list[i].type + '"]'));
    }
  }


  var __helper_import_json = function(json, clean_template) {
    json=jsonParse(json);
    var __generalSettings = json.settings;


    var __imported_template_container = jQuery('<div/>');
    var __rows = json.rows;
    var __row_html = '';
    var __row_label = settings.languages.structure_label;
    if (ec_woo_debug) {
      console.log(__rows);
    }
    for (var i = 0; i < __rows.length; i++) {
      __row_html = '';
      var __row_id = parseInt(__rows[i].id);
      var __row_item = utils.structure.where(__row_id)[0];
      var __temp_row = jQuery('<div/>');
      __temp_row.html(utils.structure.get_template(__row_label, __row_item.content, __row_item.id, __generalSettings.width));
      //__imported_template_container.append(utils.structure.get_template(__row_label, __row_item.content, __row_item.id, __generalSettings.width));

      //var __row_added = __imported_template_container.find('.ec-preview-content-sortable-row[data-id="' + __row_id + '"]');

      var __columns = __rows[i].columns;
      __temp_row.find('.main-row-table').each(function(index) {
        var __self_column = jQuery(this);
        var __column_wrapper = __self_column.find('.ec-preview-content-sortable-column-wrapper');

        var __column_elements = __columns[index].elements;
        var __column_elements_html = '';
        for (var e = 0; e < __column_elements.length; e++) {

          var __id = parseInt(__column_elements[e].id);
          var __options = __column_elements[e].options;

          switch (__column_elements[e].type) {
            case 'spacer':
              __column_elements_html += __helper_import_json_spacer(__options, __id);
              break;

            case 'text':
              __column_elements_html += __helper_import_json_text(__options, __id);
              break;

            case 'divider':
              __column_elements_html += __helper_import_json_divider(__options, __id);
              break;

            case 'button':
              __column_elements_html += __helper_import_json_button(__options, __id);
              break;

            case 'social':
              __column_elements_html += __helper_import_json_social(__options, __id);
              break;

            case 'video':
              __column_elements_html += __helper_import_json_video(__options, __id);
              break;

            case 'image':
              __column_elements_html += __helper_import_json_image(__options, __id);
              break;
          }
          //__column_elements_html += __column_elements[e].type;
        }
        __column_wrapper.append(__column_elements_html);


      });

      __temp_row.find('.ec-preview-content-sortable-row').css('background-color', __rows[i].options.backgroundColor);
      __temp_row.find('.ec-preview-content-sortable-row-body').css('background-color', __rows[i].options.contentColor);
      __temp_row.find('.main-column').css('background-color', __rows[i].options.contentColor);



      __imported_template_container.append(__temp_row.html());

    }

    if (clean_template == true) {
      jQuery('.ec-preview-content-sortable').html(__imported_template_container.html());
      __helper_import_json_general_settings(__generalSettings);
    } else {
      jQuery('.ec-preview-content-sortable').append(__imported_template_container.html());
    }
    utils.load_column_empty_label();

    utils.draggable_row();
    utils.sortable_row();
    utils.draggable_column();
    utils.sortable_column();
    utils.hide_empty_column();

    utils.helper_export_button();

    make_image_proper_size();
  }


  jQuery(document).on('click', '.ec-control-preview', function(e) {
    var _self = jQuery(this);
    var _menu_main = jQuery('#header-menu-main');
    var _menu_preview = jQuery('#header-menu-preview');
    //
    _menu_main.slideUp(300, function() {
      _menu_preview.slideDown(300);
      jQuery('.ec-preview-header').removeClass('active');
      _menu_preview.addClass('active');
    });
    jQuery('.ec-panel-switcher').click();
  });
  jQuery(document).on('click', '.ec-control-back', function(e) {
    var _self = jQuery(this);
    var _menu_main = jQuery('#header-menu-main');
    var _menu_preview = jQuery('#header-menu-preview');

    _menu_preview.slideUp(300, function() {
      _menu_main.slideDown(300);
      jQuery('.ec-preview-header').removeClass('active');
      _menu_main.addClass('active');
    });
    jQuery('.ec-panel-switcher').click();

  });



  var __load_functions = function() {

    functions.export_json = __helper_export_json;
    functions.export_html = __helper_export_html;
    functions.import_json = __helper_import_json;

  }

  utils.loadFuntions.push(__load_functions);

}(this));
(function(global) {
  "use strict";
  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});

  var tooltip = 'ec-tooltip';
  var tooltipText = 'ec-tooltip-text';
  var tooltipAttr = 'data-title';
  var tooltipAttr_s = '[data-title]';
  var headerContainer = '.ec-preview-header';

  var header_title = function() {

    var tooltipElements = jQuery(headerContainer).find(tooltipAttr_s);
    tooltipElements.each(function() {
      var self = jQuery(this);
      self.addClass(tooltip);
      var text = self.attr(tooltipAttr);
      self.append('<div class=' + tooltipText + '>' + text + '</div>');
    });
  };

  utils.loadFuntions.push(header_title);

}(this));
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});
  var functions = builder.Functions || (builder.Functions = {});

  var modal_main_class = '.ec-modal-library';
  var btn = '.ec-control-templates';
  var modal = '.ec-modal';
  var modalContainer = '#modal-library';
  var btnClose = '.ec-modal-library [data-type="close"]';
  var activeClass = 'active';
  var select2 = '.ec-category-select2';


  //tab
  var tabItem = '.ec-modal-library-tabs-item';
  var tabActive = 'active';
  var tabContent = '.ec-modal-library-tab-content-item';
  var tabContentAttr = 'data-content';

  //template
  var _templateContent = '#modal-library-templates .ec-modal-library-element-list';
  var _templateContentItem = '#modal-library-templates .ec-modal-library-element-item';
  var _templateCategory = '#ec-modal-library-toolbar-category-selector';
  var _templateGeneratedSelect2 = '#modal-library-templates .ec-modal-library-toolbar-category .select2';
  var _templateItem = '#modal-library-templates  .ec-modal-library-element-item-image-preview';
  var _templateSearch = '#modal-library-templates  .ec-modal-library-toolbar-search-input';


  //blocks
  var _blockContent = '#modal-library-blocks .ec-modal-library-element-list';
  var _blockContentItem = '#modal-library-blocks .ec-modal-library-element-item';
  var _blockCategory = '#modal-library-blocks .ec-modal-library-toolbar-category-selector';
  var _blockGeneratedSelect2 = '#modal-library-blocks .ec-modal-library-toolbar-category .select2';
  var _blockItem = '#modal-library-blocks  .ec-modal-library-element-item-image-preview';
  var _blockSearch = '#modal-library-blocks  .ec-modal-library-toolbar-search-input';

  //my templates
  var _savedContent = '#modal-library-my-templates .ec-modal-library-grid';
  var _savedSearch = '#modal-library-my-templates  .ec-modal-library-toolbar-search-input';


  var _modalContent = '.ec-modal-library-content';
  var _modalPreview = '.ec-modal-library-preview';
  var _modalPreviewIframe = '.ec-modal-library-preview-content-frame';

  var _btnPreviewBack = '.ec-modal-library-preview-back';

  var _modalPreviewInsertButton = '.ec-modal-library-preview-actions-insert';

  var _modalPreviewInsertAttr = '.ec-modal-library [data-action="load-template"]';

  var _filename = 'modal-library.js';



  //open modal
  jQuery(document).on('click', btn, function(e) {
    //load my templates
    load_saved_templates();

    jQuery(this).parents(modal_main_class).find(tabItem).eq(2).click();
    jQuery(_modalPreview).hide();
    jQuery(_modalContent).show();
    jQuery(modalContainer).fadeIn();
  });

  var __helper_modal_close = function() {
    jQuery(modalContainer).fadeOut();
  }
  //close modal
  jQuery(document).on('click', btnClose, function(e) {
    jQuery(this).parents('.ec-modal-library').fadeOut();
  });

  //change tab
  jQuery(document).on('click', tabItem, function(e) {

    var self = jQuery(this);
    if (self.parents('#modal-preview').length!=0) {
      return false;
    }
    var _tabContent = self.attr(tabContentAttr);

    self.parents(modal_main_class).find(tabItem).removeClass(tabActive);
    self.parents(modal_main_class).find(tabContent).removeClass(tabActive);

    self.addClass(tabActive);
    self.parents(modal_main_class).find(_tabContent).addClass(tabActive);
  });

  // //close modal when click outside
  // jQuery(document).click(function(event) {
  //   if (!jQuery(event.target).parents(".ec-modal-library," + btn).length) {
  //     jQuery(modalContainer).fadeOut();
  //   }
  // });


  //back from preview to the elements list
  jQuery(document).on('click', _btnPreviewBack, function(e) {
    jQuery(_modalPreview).hide();
    jQuery(_modalContent).show();
  });

  var _searchTemplate = function() {
    var category = jQuery(_templateCategory).val();
    var name = jQuery(_templateSearch).val();
    var result = utils.templates.search(parseInt(category), name);
    jQuery(_templateContent).html(utils.templates.generate(result));
  }
  //template category change event
  jQuery(document).on('change', _templateCategory, function(e) {
    _searchTemplate();
  });

  //template search
  jQuery(document).on('keyup', _templateSearch, function(e) {
    _searchTemplate();
  });
  var __preview_iframe_show = function(id, type, preview_url) {
    //jQuery(_modalPreviewIframe).attr('src', '');
    jQuery(_modalPreviewInsertButton).attr('data-type', type);
    jQuery(_modalPreviewInsertButton).attr('data-id', id);



    // utils.loadFile(preview_url, function(response) {
    //   jQuery(_modalPreviewIframe).html(response)
    // });


    jQuery('.ec-modal-library-preview-content-loading').show();
    jQuery(_modalPreviewIframe).hide();

    jQuery(_modalPreviewIframe).attr('src', preview_url);


    jQuery(_modalPreviewIframe).on('load', function() {
      jQuery(_modalPreviewIframe).show();
      jQuery('.ec-modal-library-preview-content-loading').hide();


      __generate_shortcode_for_iframe();
    });
  }
  var __generate_shortcode_for_iframe = function() {

    var iframe_content = jQuery('.ec-modal-library-preview-content-frame').contents();
    iframe_content.find('.ec-preview-content-sortable-column[data-settings-type="text"]').each(function() {
      var __self = jQuery(this);
      var __generate = do_shortcode(__self.html());
      __self.html(__generate);
    });
    iframe_content.find('[data-shortcode]').each(function() {
      var __self = jQuery(this);
      __self.removeAttr('data-shortcode');
    });

  }
  //template Item click event- show preview
  jQuery(document).on('click', _templateItem, function(e) {
    var _self = jQuery(this);
    jQuery(_modalContent).hide();
    var _dataId = parseInt(_self.parents(_templateContentItem).attr('data-id'));
    var _previewURL = utils.templates.where(_dataId)[0].preview;

    __preview_iframe_show(_dataId, 'templates', _previewURL);

    jQuery(_modalPreview).show();
  });


  var _searchBlock = function() {
    var category = jQuery(_blockCategory).val();
    var name = jQuery(_blockSearch).val();
    var result = utils.blocks.search(parseInt(category), name);
    jQuery(_blockContent).html(utils.blocks.generate(result));
  }
  //template category change event
  jQuery(document).on('change', _blockCategory, function(e) {
    _searchBlock();
  });

  //template search
  jQuery(document).on('keyup', _blockSearch, function(e) {
    _searchBlock();
  });

  //template Item click event- show preview
  jQuery(document).on('click', _blockItem, function(e) {
    var _self = jQuery(this);
    jQuery(_modalContent).hide();
    var _dataId = parseInt(_self.parents(_blockContentItem).attr('data-id'));
    var _previewURL = utils.blocks.where(_dataId)[0].preview;

    __preview_iframe_show(_dataId, 'blocks', _previewURL);

    jQuery(_modalPreview).show();
  });
  //mytempates search
  jQuery(document).on('keyup', _savedSearch, function(e) {
    _searchSaved();
  });
  var _searchSaved = function() {
    var name = jQuery(_savedSearch).val();
    var result = utils.saved_templates.search(name);
    jQuery(_savedContent).html(utils.saved_templates.generate(result));
  }
  //load
  var modal_library = function() {

    jQuery(_templateCategory).html(utils.getTemplatesCategory);
    jQuery(_templateContent).html(utils.templates.generate(utils.templates.list));

    jQuery(_blockCategory).html(utils.getBlocksCategory);
    jQuery(_blockContent).html(utils.blocks.generate(utils.blocks.list));


  };
  utils.loadFuntions.push(modal_library);

  var __helper_insert_button_blocks = function(id) {
    var __element = utils.blocks.where(id)[0];
    utils.loadFile(__element.data, function(response) {
      functions.import_json(response, false);
      __helper_modal_close();
      //generate_shortcode_for_all_text();
    });
  }

  var __helper_insert_button_templates = function(id) {
    var __element = utils.templates.where(id)[0];
    utils.loadFile(__element.data, function(response) {
      functions.import_json(response, false);
      __helper_modal_close();
      generate_shortcode_for_all_text();
    });
  }


  jQuery(document).on('click', _modalPreviewInsertAttr, function(e) {
    var __self = jQuery(this);
    var __type = __self.attr('data-type');
    var __id = parseInt(__self.attr('data-id'));


    switch (__type) {
      case 'blocks':
        __helper_insert_button_blocks(__id);
        break;
      case 'templates':
        //remove current template
        jQuery('.ec-preview-content-sortable .ec-preview-content-sortable-row').remove();

        __helper_insert_button_templates(__id);
        break;
    }

  });



}(this));
(function() {
  "use strict";
  var btn = '[data-has-modal="true"]';
  var modal = '.ec-modal';
  var modalContentAttr = 'data-modal';
  //data-has-modal="true" data-modal="#modal-send-email"
  var btnClose = '.ec-modal-close';
  var btn_fileChooser = '.ec-modal-file-label';
  var btn_fileContainer = '.ec-modal-input-container';
  var btn_fileinput = '.ec-modal-file-input';
  //var btn_fileLabel = '#ec-import-filename';
  var activeClass = 'active';

  jQuery(document).on('click', btn, function(e) {
    var modalContainer = jQuery(this).attr(modalContentAttr);
    jQuery('.ec-modal-input').val('');
    jQuery('#ec-import-all-filename,#ec-import-filename').text('');

    jQuery('#ec-modal-input-submit').removeClass('.ec-clicked');
    jQuery('#ec-modal-input-submit').find('.ec-modal-input-submit-label').show();
    jQuery('#ec-modal-input-submit').find('.ec-modal-input-submit-loading').hide();

    jQuery('.ec-modal-input').removeClass('ec-modal-input-has-error');
    jQuery('#ec-import-all-file-error').hide();
    jQuery(modalContainer).fadeIn();
  });

  jQuery(document).on('click', btnClose, function(e) {
    var modalContainer = jQuery(this).parents(modal);
    jQuery(modalContainer).fadeOut();
  });

  jQuery(document).on('click', btn_fileChooser, function(e) {
    jQuery(btn_fileinput).focus();
  });

  jQuery(document).on('change', btn_fileinput, function(e) {
    var btn_fileLabel=jQuery(this).attr('data-change-label');
    var fileName = e.target.files[0].name;
    jQuery(btn_fileContainer).addClass(activeClass);
    jQuery(btn_fileLabel).text(fileName);
  });
  // jQuery(document).click(function(event) {
  //   if (!jQuery(event.target).parents(".ec-modal," + btn).length) {
  //     jQuery('.ec-modal').fadeOut();
  //   }
  // });
})();
(function(global) {
  "use strict";

  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});



  jQuery(function() {

  });

}(this));
(function(global) {
  "use strict";
  var builder = global.ec_builder || (global.ec_builder = {});
  var utils = builder.Utils || (builder.Utils = {});
  var settings = builder.Settings || (builder.Settings = {});


  var success = function() {

    for (var i = 0; i < utils.loadFuntions.length; i++) {
      utils.loadFuntions[i]();
    }

  }
  var error = function(jqXHR, textStatus, errorThrown) {

  }


  jQuery(function() {
    settings.load(success, error);
  });

}(this));

var builder_1 = this.ec_builder || (this.ec_builder = {});
var utils_1 = builder_1.Utils || (builder_1.Utils = {});
var settings_1 = builder_1.Settings || (builder_1.Settings = {});
var templates_1 = builder_1.Templates || (builder_1.Templates = {});

var load_saved_templates = function (callback) {
    var _savedContent = '#modal-library-my-templates .ec-modal-library-grid';
    var $saved_content = jQuery(_savedContent);

    $saved_content.html(templates_1.template_saved_no_data('Loading...'));
    var data = {
        action: 'template_load_saved'
    };

    ajax_request(data, function (response) {
        this.builder_1.Settings.saved_templates = response.data;
        $saved_content.html(utils_1.saved_templates.generate(utils_1.saved_templates.list()));
        if (callback !== undefined) {
            callback();
        }
    });
}