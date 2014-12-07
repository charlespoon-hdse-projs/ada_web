/*
 * each: { id, name_en, images[], price$, tag[ tagName, tagValue ] }
 */
scResultItems = [];

/*
 * each: { tagName{ tagValue[ -->$+ ] }+ }
 */
scTagStore = {};

scLoadSubCategory = function(subCategory, catJson, fromDir, doneFunc) {
    var ok = false;

    var subJsonUrl = null;
    $.each(catJson.subcategories, function(i, item) {
        if (item.subName == subCategory) subJsonUrl = item.jsonUrl;
    });
    if (subJsonUrl !== null) {
        $.getJSON(fromDir + "/" + subJsonUrl)
            .done(function(json) {
                if (json === null) {
                    scOnReturnDataError("Cannot parse returned context as JSON.");
                } else if (json.subcategory === undefined || json.items === undefined) {
                    scOnReturnDataError("Returned JSON type does not match.");
                //} else if( json.subcategory !== subCategory) {
                //    scOnReturnDataError("Returned sub-category does not match.");
                } else {
                    var subdir = subJsonUrl;
                    var trim = subdir.lastIndexOf("/");
                    if (trim > 0) subdir = subdir.substr(0, trim + 1);
                    var imgdir = fromDir + "/" + subdir;
                    $.each(json.items, function(i, item) {
                        for (var i = 0; i < item.images.length; i++) item.images[i] = imgdir + item.images[i];
                    });
                    doneFunc(json.items);
                    ok = true;
                }
            })
            .fail(function(jqxhr, textStatus, error) {
                scOnLoadFailed(jqxhr, textStatus, error);
            });
    }
    return ok;
};

// return jqXHR, which is a AsyncState to compare to xhr on ajaxComplete
scLoadData = function(category, subcategory, onComplete) {
    if (category === undefined && subcategory === undefined)
        return;

    return $.getJSON('fakeDb/' + category + '.json')
        .done(function(json) {
            if (json === null) {
                scOnReturnDataError("Cannot parse returned context as JSON.");
            } else if (json.category === undefined || json.subcategories === undefined) {
                scOnReturnDataError("Returned JSON type does not match.");
            } else if (json.category !== category) {
                scOnReturnDataError("Returned category does not match.");
            } else {
                // really put things
                var subs = [];
                if (subcategory !== undefined) subs.push(subcategory);
                else {
                    $.each(json.subcategories, function(i, item) {
                       subs.push(item.subName);
                    });
                }
                $.each(subs, function(i, item) {
                    scLoadSubCategory(item, json, "fakeDb/", function(items) {
                        $.merge(scResultItems, items);
                        onComplete(scResultItems);
                    });
                });

                scOnLoadSuccessful(json);
            }
        })
        .fail(function(jqxhr, textStatus, error) {
            scOnLoadFailed(jqxhr, textStatus, error);
        });
};

var scOnLoadSuccessful = function(data){

};
var scOnLoadFailed = function(jqxhr, textStatus, error){

};
var scOnReturnDataError = function(textStatus){

};

scCreateBigViewAndTag = function(item) {
    var ret = $("<div productid=\"" + item.id + "\">").addClass("bigViewItem");
    ret.append($("<div>").addClass("photo").append($("<img>", {"src": item.images[0]})));
    ret.append($("<span>").addClass("title").html(item.name_en));
    ret.append($("<br />"));
    ret.append($("<span>").addClass("price").html(item.price));

    scPutJqIntoTagStore(ret, item.tag);

    return ret;
};

scCreateDetailViewAndTag = function(item) {
    var ret = $("<div productid=\"" + item.id + "\">").addClass("detailViewItem");
    ret.append($("<div>").addClass("photo").append($("<img>", {"src": item.images[0]})));
    ret.append($("<span>").addClass("title").html(item.name_en));
    ret.append($("<br />"));
    ret.append($("<span>").addClass("price").html(item.price));

    scPutJqIntoTagStore(ret, item.tag);

    return ret;
};

var scGenerateFilter = function() {
    var gened = false;

    $.each(Object.keys(scTagStore), function(i, k) {
        var fs = $('<fieldset>').addClass("filter");
        fs.append($('<legend>').html(k));
        $.each(Object.keys(scTagStore[k]), function(ii, kk) {
            fs.append($('<label>')
                    .html(kk)
                    .prepend(
                    $('<input>', {
                        "type": "checkbox",
                        "checked": "checked",
                        "name": k,
                        "value": kk
                    })
                )
            );
        });
        $("#searchTools > #fieldsets").append(fs);
        gened = true;
    });

    if (!gened) {
        $("#searchTools > #fieldsets").append($('<span>').addClass('fallback').html('Nothing could be filtered right now.'));
        $("#searchTools > button").remove();
    }
};

var scPutJqIntoTagStore = function(jq, tag) {
    if(tag === undefined || tag === null) return;
    $.each(tag, function(i, item) {
        if (scTagStore[item.tagName] === undefined)
            scTagStore[item.tagName] = {};
        if (scTagStore[item.tagName][item.tagValue] === undefined)
            scTagStore[item.tagName][item.tagValue] = [];

        scTagStore[item.tagName][item.tagValue].push(jq);
    });
};

scRefreshTagStoreToShow = function() {
    var t = [];
    var f = [];
    $("fieldset.filter input[type=checkbox]").each(function(i, item) {
        $.merge((item.checked ? t : f), scTagStore[item.name][item.value]);
    });
    $.each(f, function(i, item) {
        if (t.indexOf(item) < 0) item.hide();
    });
    $.each(t, function(i, item) {
        item.show();
    });
};

scGenerateViewsAndAppend = function() {
    $.each(scResultItems, function(i, item) {
        $("#searchResult > .bigView > .bigViewWrapper").append(scCreateBigViewAndTag(item)).append('&nbsp;');
        $("#searchResult > .detailView").append(scCreateDetailViewAndTag(item));
    });
    scGenerateFilter();
    $("#searchResultStat #found").html("Found results: " + scResultItems.length);
};