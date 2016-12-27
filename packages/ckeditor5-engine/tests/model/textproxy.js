/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* bender-tags: model */

import Element from 'ckeditor5-engine/src/model/element';
import Text from 'ckeditor5-engine/src/model/text';
import TextProxy from 'ckeditor5-engine/src/model/textproxy';
import Document from 'ckeditor5-engine/src/model/document';
import CKEditorError from 'ckeditor5-utils/src/ckeditorerror';

describe( 'TextProxy', () => {
	let doc, element, textProxy, root, textProxyNoParent, text, textNoParent;

	beforeEach( () => {
		doc = new Document();
		root = doc.createRoot();
		element = new Element( 'div' );
		root.insertChildren( 0, element );

		text = new Text( 'foobar', { foo: 'bar' } );
		element.insertChildren( 0, [ new Text( 'abc' ), text ] );
		textProxy = new TextProxy( text, 2, 3 );

		textNoParent = new Text( 'abcxyz' );
		textProxyNoParent = new TextProxy( textNoParent, 1, 1 );
	} );

	it( 'should have data property', () => {
		expect( textProxy ).to.have.property( 'data' ).that.equals( 'oba' );
		expect( textProxyNoParent ).to.have.property( 'data' ).that.equals( 'b' );
	} );

	it( 'should have root property', () => {
		expect( textProxy ).to.have.property( 'root' ).that.equals( root );
		expect( textProxyNoParent ).to.have.property( 'root' ).that.equals( textNoParent );
	} );

	it( 'should have document property', () => {
		expect( textProxy ).to.have.property( 'document' ).that.equals( doc );
		expect( textProxyNoParent ).to.have.property( 'document' ).that.equals( null );
	} );

	it( 'should have parent property', () => {
		expect( textProxy ).to.have.property( 'parent' ).that.equals( element );
		expect( textProxyNoParent ).to.have.property( 'parent' ).that.equals( null );
	} );

	it( 'should have textNode property', () => {
		expect( textProxy ).to.have.property( 'textNode' ).that.equals( text );
		expect( textProxyNoParent ).to.have.property( 'textNode' ).that.equals( textNoParent );
	} );

	it( 'should have startOffset property', () => {
		expect( textProxy ).to.have.property( 'startOffset' ).that.equals( 5 );
		expect( textProxyNoParent ).to.have.property( 'startOffset' ).that.is.null;
	} );

	it( 'should have offsetSize property', () => {
		expect( textProxy ).to.have.property( 'offsetSize' ).that.equals( 3 );
		expect( textProxyNoParent ).to.have.property( 'offsetSize' ).that.equals( 1 );
	} );

	it( 'should have endOffset property', () => {
		expect( textProxy ).to.have.property( 'endOffset' ).that.equals( 8 );
		expect( textProxyNoParent ).to.have.property( 'endOffset' ).that.equals( null );
	} );

	it( 'should have offsetInText property', () => {
		expect( textProxy ).to.have.property( 'offsetInText' ).that.equals( 2 );
		expect( textProxyNoParent ).to.have.property( 'offsetInText' ).that.equals( 1 );
	} );

	it( 'should have isPartial property', () => {
		let startTextProxy = new TextProxy( text, 0, 4 );
		let fullTextProxy = new TextProxy( text, 0, 6 );

		expect( textProxy.isPartial ).to.be.true;
		expect( startTextProxy.isPartial ).to.be.true;
		expect( fullTextProxy.isPartial ).to.be.false;
	} );

	it( 'should throw if wrong offsetInText is passed', () => {
		expect( () => {
			new TextProxy( text, -1, 2 );
		} ).to.throw( CKEditorError, /model-textproxy-wrong-offsetintext/ );

		expect( () => {
			new TextProxy( text, 9, 1 );
		} ).to.throw( CKEditorError, /model-textproxy-wrong-offsetintext/ );
	} );

	it( 'should throw if wrong length is passed', () => {
		expect( () => {
			new TextProxy( text, 2, -1 );
		} ).to.throw( CKEditorError, /model-textproxy-wrong-length/ );

		expect( () => {
			new TextProxy( text, 2, 9 );
		} ).to.throw( CKEditorError, /model-textproxy-wrong-length/ );
	} );

	describe( 'getPath', () => {
		it( 'should return path to the text proxy', () => {
			expect( textProxy.getPath() ).to.deep.equal( [ 0, 5 ] );
			expect( textProxyNoParent.getPath() ).to.deep.equal( [] );
		} );
	} );

	describe( 'getAncestors', () => {
		it( 'should return proper array of ancestor nodes', () => {
			expect( textProxy.getAncestors() ).to.deep.equal( [ root, element ] );
		} );

		it( 'should include itself if includeNode option is set to true', () => {
			expect( textProxy.getAncestors( { includeNode: true } ) ).to.deep.equal( [ root, element, textProxy ] );
		} );

		it( 'should reverse order if parentFirst option is set to true', () => {
			expect( textProxy.getAncestors( { includeNode: true, parentFirst: true } ) ).to.deep.equal( [ textProxy, element, root ] );
		} );
	} );

	describe( 'attributes interface', () => {
		describe( 'hasAttribute', () => {
			it( 'should return true if text proxy has attribute with given key', () => {
				expect( textProxy.hasAttribute( 'foo' ) ).to.be.true;
			} );

			it( 'should return false if text proxy does not have attribute with given key', () => {
				expect( textProxy.hasAttribute( 'abc' ) ).to.be.false;
			} );
		} );

		describe( 'getAttribute', () => {
			it( 'should return attribute with given key if text proxy has given attribute', () => {
				expect( textProxy.getAttribute( 'foo' ) ).to.equal( 'bar' );
			} );

			it( 'should return undefined if text proxy does not have given attribute', () => {
				expect( textProxy.getAttribute( 'bar' ) ).to.be.undefined;
			} );
		} );

		describe( 'getAttributes', () => {
			it( 'should return an iterator that iterates over all attributes set on the text proxy', () => {
				expect( Array.from( textProxy.getAttributes() ) ).to.deep.equal( [ [ 'foo', 'bar' ] ] );
				expect( Array.from( textProxyNoParent.getAttributes() ) ).to.deep.equal( [] );
			} );
		} );

		describe( 'getAttributeKeys', () => {
			it( 'should return an iterator that iterates over all attribute keys set on the text proxy', () => {
				expect( Array.from( textProxy.getAttributeKeys() ) ).to.deep.equal( [ 'foo' ] );
				expect( Array.from( textProxyNoParent.getAttributeKeys() ) ).to.deep.equal( [] );
			} );
		} );
	} );
} );
