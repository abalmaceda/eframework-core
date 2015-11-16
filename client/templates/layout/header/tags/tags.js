/**
 * tag helpers
 */
// let isMovingTag = false;

/**
 * isEditing
 * @summary
 * @param {String} editId - editId
 * @returns {}
 * @todo agrear mejor descripcion
 */
function isEditing(editId) {
	return Session.equals("isEditing-" + editId, true);
}

/**
 * setEditing
 * @summary
 * @param {String} id -
 * @param {String} editState -
 * @returns {void}
 * @todo agrear mejor descripcion
 */
function setEditing(id, editState) {
	Session.set("isEditing-" + id, editState);
}


/**
 * currentTag
 * @summary
 * @returns {}
 * @todo descripcion
 */
function currentTag() {
	return Session.get("currentTag");
}

// $(document).mouseup(function (e) {
//   let container;
//   container = $(".tag-edit-list");
//   if (!isMovingTag && !container.is(e.target) && container.has(e.target).length ===
//     0) {
//     setEditing(currentTag(), false);
//   }
// });

/**
 * headerTags helpers
 */

Template.headerTags.helpers({
	/**
	 * tagsComponent
	 * @summary Determina el template adecuado de acuerdo a los permisos.
	 * @returns {Blaze.Template} tagInputForm | headerLinks
	 * @todo
	 */
	tagsComponent: function () {
		if (isEditing(currentTag()) && EFrameworkCore.hasOwnerAccess()) {
			return Template.tagInputForm;
		}
		return Template.headerLinks;
	},
	/**
	 * tags
	 * @summary
	 * @returns {Number} Sum of a and b
	 * @todo documentar
	 */
	tags: function () {
		/*TODO: donde se crea la variable this.tag*/
		if (this.tag) {
			let tags = [];
			let tagDoc = Tags.findOne(this.tag._id);
			/*Si no se encuentra this.tag en la Collection, se asigna como "currentTag"="" y se retornan un arreglo vacio de tags */
			if (!tagDoc) {
				Session.set("currentTag", "");
				return tags;
			}
			/*Como existe el tag en la Collections, entonces lo asignamos como "currentTag". */
			Session.set("currentTag", this.tag._id);
			/*SE agrega el "currentTag" a una lista de tags */
			tags.push(tagDoc);
			/*TODO: averiguar que es un "relatedTagIds" */
			let relatedTagIds = tagDoc.relatedTagIds;

			/*Si existen "relatedTagIds" se agregan a la lista de tags */
			if (relatedTagIds) {
				for (let relatedTagId of relatedTagIds) {
					tags.push(Tags.findOne(relatedTagId));
				}
			}
		}
		/*TODO: Como no entiendo donde se define this.tag, tampoco entiendo en que casos esa variable puede no existir*/
		else {
			tags = Tags.find({
				isTopLevel: true
			}, {
				sort: {
				position: 1
				}
			}).fetch();
			Session.set("currentTag", "");
			/*TODO: averiguar de donde viene this.tagIds */
			if (this.tagIds) {
				/*Si existe esa lista de tagIds, entonces los recorro. Encuentro la info del tag dentro de la collection Tags. Y la guardo en el arreglo "tags"*/
				for (let relatedTagId of this.tagIds) {
					if ( !_.findWhere( tags, { _id: relatedTagId}) ) {
						tags.push(Tags.findOne(relatedTagId));
					}
				}
			}
		}
		// there are cases where
		// we'll have no tags, and sort will error
		// so we check length for safety
		/*
			Existe la posibilidad de que no hayan tags, asi que revizamos primero.
			Si existen "tags", entonces
		*/
		if (tags) {
			/*Como existen tags, los ordeno de mayor a menor.*/
			tags.sort(function (a, b) {
				return a.position - b.position;
			});
			return tags;
		}
	}
});

/**
 * headerLinks helpers
 */

Template.headerLinks.helpers({
	/**
	 * activeTag
	 * @summary Verifica si este tag (this) es "currentTag"
	 * @returns {String} CSS "active" si este tag (this) es el "currentTag"
	 * @todo Documentar ( no se cual es el uso de esto )
	 */
	activeTag: function () {
		if (Session.equals("currentTag", this._id)) {
			return "active";
		}
	}
});

/**
 * headerLinks events
 */

Template.headerLinks.events({
	/**
	 * Se_agrega_una_gran_descripcion_aca
	 * @summary Constructor_for_a_Collection
	 * @event click #header-edit-tag
	 * @returns {}
	 * @todo Documentar
	 */
	"click #header-edit-tag": function () {
		/*Cambia el estado del currentTag a modo edición.*/
		setEditing(currentTag(), true);
		/*TODO: averiguar que es tracker.flush()*/
		return Tracker.flush();
	}
});

/**
 * tagInputForm helpers
 */

Template.tagInputForm.helpers({
  tags: function () {
    let tagList = [];
    for (let tag of this.tags) {
      tagList.push(tag._id);
    }
    return tagList.toString();
  }
});

/**
 * tagInputForm events
 */

Template.tagInputForm.events({
	/**
	 * @summary Se elimina el tag del header
	 * @event click .tag-input-group-remove
	 * @param {Object} event -
	 * @param {Template} template -
	 * @returns {Number}
	 * @todo Documentar
	 */
	"click .tag-input-group-remove": function (event, template) {
		return Meteor.call("shop/removeHeaderTag", this._id, currentTag(),
			function (error) {
			if (error) {
				/* TODO: Agregar alerta localizacion */
				return Alerts.add( "Tag is in use. It must be deleted from products first.", "warning", {
					autoHide: true
				});
			}
			return template.$(".tags-submit-new").focus();
		});
	},
//   "focusin .tags-input-select": function (tagEvent) {
//     return $(tagEvent.currentTarget).autocomplete({
//       delay: 0,
//       source: function (request, response) {
//         let datums = [];
//         let slug = getSlug(request.term);
//         Tags.find({
//           slug: new RegExp(slug, "i")
//         }).forEach(function (tag) {
//           return datums.push({
//             label: tag.name
//           });
//         });
//         return response(datums);
//       },
//       select: function (event, ui) {
//         if (ui.item.value) {
//           return Meteor.call("shop/updateHeaderTags", ui.item.value,
//             this._id, currentTag(),
//             function (error) {
//               if (error) {
//                 return Alerts.add(
//                   "Tag already exists, duplicate add failed.",
//                   "danger", {
//                     autoHide: true
//                   });
//               }
//             });
//         }
//       }
//     });
//   },

	/**
	 * @summary Se obtiene el nuevo valor del tag y se envia al servidor para guardar el cambio
	 * @event focusout .tags-input-select
	 * @param {Object} event -
	 * @param {Template} template -
	 * @returns {Number} Sum of a and b
	 * @todo Documentar
	 */
	"focusout .tags-input-select": function (event, template) {
		let val;
		val = $(event.currentTarget).val();
		/*Si existe un valor de Tag, se envia al servidor*/
		if (val) {
			return Meteor.call("shop/updateHeaderTags", val, this._id, currentTag(), function (error) {
				if (error) {
					Alerts.add("Tag already exists, duplicate add failed.", "danger", {
						autoHide: true
					});
				}
				return template.$(".tags-submit-new").val("").focus();
			});
		}
	},
//   "mousedown .tag-input-group-handle": function (event, template) {
//     isMovingTag = true;
//     Tracker.flush();
//     return template.$(".tag-edit-list").sortable("refresh");
//   }
});

/**
 * tagInputForm onRendered
 */

Template.tagInputForm.onRendered(function () {
//   return $(".tag-edit-list").sortable({
//     items: "> li",
//     axis: "x",
//     handle: ".tag-input-group-handle",
//     update: function () {
//       let uiPositions = $(this).sortable("toArray", {
//         attribute: "data-tag-id"
//       });
//       let _results = [];
//       for (let tag of uiPositions) {
//         _results.push(Tags.update(tag, {
//           $set: {
//             position: _.indexOf(uiPositions, tag)
//           }
//         }));
//       }
//       return _results;
//     },
//     stop: function () {
//       isMovingTag = false;
//       return isMovingTag;
//     }
//   });
});
