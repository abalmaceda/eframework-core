/**
 * Template.productDetailTags.helpers
 * @summary Helpers para Template.productDetailTags
 */
Template.productDetailTags.helpers({
	/**
	 * currentHashTag
	 * @summary
	 * @returns {Boolean}
	 * @todo Documentacion
	 */
	currentHashTag: function () {
		let product = selectedProduct();
		if (product) {
			/* TODO : que es handle del product */
			if (product.handle) {
				/* TODO : para que hacen esto */
				if (product.handle === product.handle.toLowerCase()) {
					return true;
				}
			}
		}
	}
});

/**
 * Template.productTagInputForm.helpers
 * @summary Helpers para Template.productTagInputForm
 */
Template.productTagInputForm.helpers({
	/**
	 * @summary Agrega un simbolo al tag
	 * @returns {void}
	 * @todo entender para que sirve, y como discrimina entre los dos tipos de marcas
	 */
	hashtagMark: function () {
		let product = selectedProduct();
		if (product) {
			if (product.handle) {
				if (this.handle === product.handle.toLowerCase() || getSlug(product.handle) === this.slug) {
					return "fa-bookmark";
				}
				return "fa-bookmark-o";
			}
		}
	}
});

/**
 * Template.productTagInputForm.events
 * @summary Events para Template.productTagInputForm
 */
Template.productTagInputForm.events({
	"click .tag-input-hashtag": function () {
		return Meteor.call("products/setHandleTag", selectedProductId(), this ._id, function (error, result) {
			if (result) {
				return Router.go("product", {_id: result });
			}
		});
	},
	/**
	 * @summary Se elimina un tag del producto seleccionado
	 * @event click .tag-input-group-remove
	 * @param {Object} event -
	 * @param {Template} template -
	 * @returns {void}
	 * @todo Documentar
	 */
	"click .tag-input-group-remove": function (event, template) {
		/*
			The handler function receives two arguments:
				- event, an object with information about the event, and
				- template, a template instance for the template where the handler is defined.
			The handler also receives some additional context data in this, depending on the context of the current element handling the event
		*/
		return Meteor.call("products/removeProductTag", selectedProductId(), this._id);
	},
	/**
	 * @summary Entrega sugerencias de acuerdo a los Tag que ya existen. REcordar que los Tags se comparten entre los productos, no así los atributos.
	 * @event click .tag-input-group-remove
	 * @param {Object} event -
	 * @param {Template} template -
	 * @returns {void}
	 * @todo Documentar
	 */
	"click .tags-input-select": function (event) {
		return $(event.currentTarget).autocomplete({
			delay: 0,
			autoFocus: true,
			source: function (request, response) {
				let datums = [];
				let slug = getSlug(request.term);
				Tags.find({
					slug: new RegExp(slug, "i")
				}).forEach(function (tag) {
					return datums.push({
						label: tag.name
					});
				});
				return response(datums);
			}
		});
	},
	/**
	 * @summary Update del tag si este cambia de valor
	 * @event change .tags-input-select
	 * @param {Object} event -
	 * @param {Template} template -
	 * @returns {void}
	 * @todo Documentar
	 */
	"change .tags-input-select": function (event, template) {
		let val = $(event.currentTarget).val();
		if (val) {
			let currentTag = Session.get("currentTag");
			return Meteor.call("products/updateProductTags", selectedProductId(), val, this._id, currentTag, function (error) {
				template.$(".tags-submit-new").val("").focus();
				if (error) {
					/*Agregar texto en idiomas */
					Alerts.add("Tag already exists, duplicate add failed.", "danger", {
						autoHide: true
					});
					return false;
				}
			});
		}
	},
  // "mousedown .tag-input-group-handle": function (event, template) {
  //   return template.$(".tag-edit-list").sortable("refresh");
  // }
});

/**
 * @summary Permite cambiar el orden de los tags del producto
 * @event change .tags-input-select
 * @param {Object} event -
 * @param {Template} template -
 * @returns {void}
 * @todo Documentar
 */
Template.productTagInputForm.onRendered(function () {
	return $(".tag-edit-list").sortable({
		/* TODO : Entender que significa  esto "> li" */
		items: "> li",
		handle: ".tag-input-group-handle",
		opacity: 0.7,
		helper: "clone",
		placeholder: "tag-sortable",
		forcePlaceholderSize: true,
		/*Cada vez que existe un update, se ejecuta la siguiente funcion*/
		update: function (event, ui) {
			let hashtagsList = [];
			let uiPositions = $(this).sortable("toArray", { attribute: "data-tag-id" });
			for (let tag of uiPositions) {
				if(tag !== ""){
					hashtagsList.push(tag);
				}
			}
			/*Se actualiza la lista de tags en el servidor*/
			return Meteor.call("products/updateProductField", selectedProductId(), "hashtags", hashtagsList);
		},
		start: function(event, ui) {
			ui.placeholder.height(ui.helper.height());
			ui.placeholder.html("Drop tag to reorder");
			ui.placeholder.css("padding-top", ui.helper.height() / 3);
			ui.placeholder.css("border", "1px dashed #ccc");
			return ui.placeholder.css("border-radius", "6px");
		}
	});
});
