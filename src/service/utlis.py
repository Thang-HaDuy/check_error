from datetime import date

def get_quarter_start_date(quarter: int, year: int) -> date:
    if quarter not in [1, 2, 3, 4]:
        raise ValueError("Quý phải nằm trong khoảng từ 1 đến 4.")

    start_month = (quarter - 1) * 3 + 1
    startDate = date(year, start_month, 1)
    return startDate.strftime("%d/%m/%Y")

# date(year, (quarter - 1) * 3 + 1, 1).strftime("%d/%m/%Y")

mappingRoadStructure = {
    "179": "Mặt đường bê tông nhựa",
    "180": "Mặt đường bê tông xi măng",
    "181": "Mặt đường cấp phối",
    "182": "Mặt đường đất",
    "183": "Mặt đường nhựa",
}

directionId8 = {
    "TRANSVERSE": 'NGANG',
    "LONGITUDINAL": 'DOC',
}

culvertApertureId8 = {
    "40": "0.5-2m",
    "41": "10m"
}
