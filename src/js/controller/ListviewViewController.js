/**
 * @author Jörn Kreutel
 */
import { mwf } from "vfh-iam-mwf-base";
import { mwfUtils } from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";

export default class ListviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    // TODO-REPEATED: declare custom instance attributes for this controller
    items;
    addNewMediaItemElement;

    constructor() {
        super();

        console.log("ListviewViewController()");
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        this.addListener(new mwf.EventMatcher("crud", "deleted", "MediaItem"), ((event) => {
            this.markAsObsolete();
        }), true);
        this.addListener(new mwf.EventMatcher("crud", "created", "MediaItem"), ((event) => {
            this.addToListview(event.data);
        }));
        this.addListener(new mwf.EventMatcher("crud", "updated", "MediaItem"), ((event) => {
            this.updateInListview(event.data._id, event.data);
        }));
        this.addListener(new mwf.EventMatcher("crud", "deleted", "MediaItem"), ((event) => {
            this.removeFromListview(event.data);
        }));

        // TODO: do databinding, set listeners, initialise the view
        this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");

        this.addNewMediaItemElement.onclick = (() => {
            /*
                this.crudops.create(new entities.MediaItem("m", "https://picsum.photos/100/100")).then((created) => {
                    this.addToListview(created);
                }
                );
            });
            */
            this.createNewItem();
        });
        /*
        this.crudops.readAll().then((items) => {
            this.initialiseListview(items);
        });
        */
        entities.MediaItem.readAll().then((items) => {
            this.initialiseListview(items);
        });

        // call the superclass once creation is done
        super.oncreate();
    }
    createNewItem() {
        var newItem = new entities.MediaItem("", "https://picsum.photos/100/100");
        this.showDialog("mediaItemDialog", {
            item: newItem,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    newItem.create().then(() => {
                        //this.addToListview(newItem);
                    });
                    this.hideDialog();
                })
            }
        });
    }


    /*
     * for views that initiate transitions to other views
     * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
     */
    async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
        // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
        if (nextviewid == "mediaReadview" && returnValue && returnValue.deletedItem) {
            this.removeFromListview(returnValue.deletedItem._id);
        }
    }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     
    bindListItemView(listviewid, itemview, itemobj) {
        // TODO: implement how attributes of itemobj shall be displayed in itemview
        itemview.root.getElementsByTagName("img")[0].src =
            itemobj.src;
        itemview.root.getElementsByTagName("h2")[0].textContent =
            itemobj.title+itemobj._id;
        itemview.root.getElementsByTagName("h3")[0].textContent =
            itemobj.added;
    
    }
    */

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */

    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemMenuItemSelected(menuitemview, itemobj, listview) {
        // TODO: implement how selection of the option menuitemview for itemobj shall be handled
        super.onListItemMenuItemSelected(menuitemview, itemobj,
            listview);
    }

    /*
     * for views with dialogs
     * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
     */
    bindDialog(dialogid, dialogview, dialogdataobj) {
        // call the supertype function
        super.bindDialog(dialogid, dialogview, dialogdataobj);

        // TODO: implement action bindings for dialog, accessing dialog.root
    }

    deleteItem(item) {
        item.delete(() => {
            //this.removeFromListview(item._id);
        });
    }

    editItem(item) {
        this.showDialog("mediaItemDialog", {
            item: item,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    item.update().then(() => {
                        //this.updateInListview(item._id, item);
                    });
                    55
                    this.hideDialog();
                }),/*!!!*/
                deleteItem: ((event) => {
                    this.deleteItem(item);
                    this.hideDialog();
                })

            }
        });
    }

}
