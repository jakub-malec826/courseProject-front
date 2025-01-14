import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { StoreState, useStoreDispatch } from "../../store/Store";
import { deleteFields } from "../../store/features/collectionFields/CollectionFieldsSlice";
import { AddItemToCollection } from "../../store/features/collections/CollectionsThunks";
import { emptyItem } from "../../store/features/items/ItemsSlice";
import {
	EditItemInDb,
	AddItemToDb,
} from "../../store/features/items/ItemsThunk";

import { useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { Button, Form, Offcanvas, OffcanvasHeader } from "react-bootstrap";

import { ItemStateIF } from "./CollectionItemsPage";

import HandleChange from "../../functions/HandleChange";
import objectID from "bson-objectid";

interface propsIF {
	owner: string;
	itemFormState: { show: boolean; forEdit: boolean; item: ItemStateIF };
	setItemFormState: Function;
}

export default function ItemForm({
	owner,
	itemFormState,
	setItemFormState,
}: propsIF) {
	const theme = useSelector((state: StoreState) => state.ThemeReducer.theme);
	const fields = useSelector(
		(state: StoreState) => state.CollectionFieldsReducer.fields
	);

	const [item, setItem] = useState<ItemStateIF>(emptyItem);

	const dispatch = useStoreDispatch();
	const { t } = useTranslation();
	const { userName } = useParams();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (itemFormState.forEdit) {
			dispatch(EditItemInDb(item));
		} else {
			dispatch(AddItemToDb(item));
			dispatch(
				AddItemToCollection({
					collectionId: owner,
					itemId: item._id || "",
				})
			);
		}

		setItem(emptyItem);
		dispatch(deleteFields());
		setItemFormState({ ...itemFormState, show: false });
	};

	useEffect(() => {
		const tempItems: any = { ...itemFormState.item };
		fields.map(
			(f) =>
				(tempItems[f.fieldName.toLowerCase()] =
					f.fieldType !== "checkbox" ? "" : false)
		);
		itemFormState.forEdit
			? setItem({
					...tempItems,
					owner,
			  })
			: setItem({
					...tempItems,
					_id: objectID(),
					owner,
					author: userName,
					date: new Date().toLocaleString(),
			  });
	}, [itemFormState]);

	return (
		<Offcanvas
			style={
				theme === "dark"
					? {
							backgroundColor: "rgb(21,21,21)",
							color: "rgb(240,240,240)",
					  }
					: {}
			}
			show={itemFormState.show}
			onHide={() => setItemFormState({ ...itemFormState, show: false })}
		>
			<OffcanvasHeader className="border-bottom border-secondary m-3">
				<h3 className="d-inline">
					{itemFormState.forEdit
						? (t("itemPage.itemForm.edit") as string)
						: (t("itemPage.itemForm.add") as string)}
				</h3>

				<Button
					size="sm"
					className="d-inline mb-2"
					variant={theme}
					onClick={() =>
						setItemFormState({ ...itemFormState, show: false })
					}
				>
					ｘ
				</Button>
			</OffcanvasHeader>
			<Form
				onSubmit={handleSubmit}
				className="text-center"
				style={{ overflow: "auto" }}
			>
				<Form.Group className="m-1">
					<Form.Label className="w-auto mx-auto m-2">
						{t("name") as string}
					</Form.Label>
					<Form.Control
						size="sm"
						className="w-auto mx-auto m-2"
						type="text"
						name="name"
						value={item.name}
						onChange={(e) => HandleChange(e, setItem, item)}
					/>
				</Form.Group>

				<Form.Group className="m-1">
					<Form.Label className="w-auto mx-auto m-2">
						{t("itemPage.tags") as string}
					</Form.Label>
					<Form.Control
						size="sm"
						className="w-auto mx-auto m-2"
						type="text"
						name="tag"
						placeholder="tag1,tag2,..."
						value={item.tag}
						onChange={(e) =>
							setItem({
								...item,
								tag: [...e.target.value.split(",")],
							})
						}
					/>
				</Form.Group>

				<Form.Group className="m-1">
					{fields.map((f) =>
						f.fieldType === "checkbox" ? (
							<div key={fields.indexOf(f)}>
								<Form.Check.Input
									className="mx-auto m-2"
									type="checkbox"
									name={f.fieldName.toLowerCase()}
									checked={item[f.fieldName.toLowerCase()]}
									onChange={() =>
										setItem({
											...item,
											[f.fieldName.toLowerCase()]:
												!item[
													f.fieldName.toLowerCase()
												],
										})
									}
								/>
								<Form.Label className="w-auto mx-auto m-2 ms-2 d-inline">
									{f.fieldName}
								</Form.Label>
							</div>
						) : f.fieldType !== "textarea" ? (
							<div key={fields.indexOf(f)}>
								<Form.Label className="w-auto mx-auto m-2">
									{f.fieldName}
								</Form.Label>
								<Form.Control
									size="sm"
									className="w-auto mx-auto m-2"
									type={f.fieldType}
									name={f.fieldName.toLowerCase()}
									value={item[f.fieldName.toLowerCase()]}
									onChange={(e) =>
										HandleChange(e, setItem, item)
									}
								/>
							</div>
						) : (
							<div key={fields.indexOf(f)}>
								<Form.Label className="w-auto mx-auto m-2">
									{f.fieldName}
								</Form.Label>
								<Form.Control
									size="sm"
									className="w-auto mx-auto m-2"
									as={f.fieldType}
									name={f.fieldName.toLowerCase()}
									value={item[f.fieldName.toLowerCase()]}
									onChange={(e) =>
										HandleChange(e, setItem, item)
									}
								/>
							</div>
						)
					)}
				</Form.Group>

				<Button
					size="sm"
					variant={theme}
					className="w-auto mx-auto m-2"
					type="submit"
					onClick={() =>
						setItem({ ...item, additionalField: fields })
					}
				>
					{itemFormState.forEdit
						? (t("edit") as string)
						: (t("add") as string)}
				</Button>
			</Form>
		</Offcanvas>
	);
}
