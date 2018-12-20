import { Component, OnInit, ComponentFactory } from '@angular/core';
import { Contact } from './contact.model';
import { Http } from '@angular/http';
@Component({

  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contacts: Array<Contact> = [];
  contactParams = '';
  constructor(private http: Http) { }

  async ngOnInit() {
    this.loadFromFile();
  }

  async loadContacts () {
    const savedContacts = this.getItemsFromLocalStorage('contacts');
    if (savedContacts && savedContacts.length > 0) {
      this.contacts = savedContacts;

    } else {
      this.contacts = await this.loadFromFile();
    }
    this.sortByID(this.contacts);
  }

  async loadFromFile() {
    const data = await this.http.get('assets/contacts.json').toPromise();
    console.log('from loadFromFile data: ', data.json());
    return data.json();
  }

  deleteContact(index: number) {
    console.log('Delete contact: index,', index);
    this.contacts.splice(index, 1);
    this.saveItemsToLocalStorage(this.contacts);
  }
  addContact() {
    this.contacts.unshift(new Contact({}));
    console.log('this.contacts ... ', this.contacts);
  }

  saveContact(contact: any) {
    console.log('save contact, ', contact);
    contact.editing = false;
    this.saveItemsToLocalStorage(this.contacts);
    }

  saveItemsToLocalStorage(contacts: Array<Contact>) {
    contacts = this.sortByID(contacts);
    const savedContacts = localStorage.setItem('contacts', JSON.stringify(contacts));
    console.log('from saveItemsToLocalStorage savedContacts: ', savedContacts);
    return savedContacts;
  }

  getItemsFromLocalStorage(key: string) {
    const savedContacts = JSON.parse(localStorage.getItem(key));
    console.log('fromsaved item', savedContacts);
    return savedContacts;
  }

  searchContact(params: string) {
    console.log(params);
    this.contacts = this.contacts.filter((item: Contact) => {
      const fullName = item.firstName + ' ' + item.lastName;
      console.log ('this is the full name, ', fullName);
      console.log('item -----> ', item.firstName);
      if (params === fullName || params === item.firstName || params === item.lastName) {
        return true;
      } else {
        return false;
      }
    });
  }

  sortByID(contacts: Array<Contact>) {
    contacts.sort((prevContact: Contact, presContact: Contact) => {

      return prevContact.id > presContact.id ? 1 : -1;
    });
    console.log('sorted contacts, ', contacts);
    return contacts;
  }
}
