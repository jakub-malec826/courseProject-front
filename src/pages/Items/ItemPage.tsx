import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { StoreState, useStoreDispatch } from "../../store/Store";
import ItemsTableView from "./ItemsTableView";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	deleteTagItems,
	GetTagItems,
} from "../../store/features/items/ItemsSlice";

export default function ItemPage() {
	const theme = useSelector((state: StoreState) => state.ThemeReducer.theme);
	const { t } = useTranslation();
	const { tagName } = useParams();

	const dispatch = useStoreDispatch();

	const tagItems = useSelector(
		(state: StoreState) => state.ItemsReducer.tagItems
	);

	let fieldList: { fieldName: string; fieldType: string }[] = [];

	useEffect(() => {
		dispatch(GetTagItems(tagName || ""));

		return () => {
			dispatch(deleteTagItems());
		};
	}, [dispatch, tagName]);

	tagItems.map((t) => (fieldList = fieldList.concat(t.additionalField)));

	return (
		<Table
			size="sm"
			striped
			variant={theme}
			responsive="sm"
			hover
			className="mx-auto w-75 m-3"
		>
			<thead>
				<tr>
					<th>Id</th>
					<th>{t("name") as string}</th>
					<th>{t("itemPage.tags") as string}</th>
					{tagItems.map((t) =>
						t.additionalField.map((tF) => (
							<th key={t.additionalField.indexOf(tF)}>
								{tF.fieldName}
							</th>
						))
					)}
				</tr>
			</thead>
			<tbody>
				{tagItems.map((t) => (
					<ItemsTableView
						key={tagItems.indexOf(t)}
						itemElement={t}
						hideComments={false}
						fieldsList={fieldList}
					/>
				))}
			</tbody>
		</Table>
	);
}